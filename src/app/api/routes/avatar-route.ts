import db from "@/db";
import { ImageInsert, images, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { S3 } from "@/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Hono } from "hono";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 4, // 4 uploads
  duration: 60 * 30, // Per 30 minutes
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/avif",
  "image/webp",
];
const MAX_WIDTH = 256;
const MAX_HEIGHT = 256;
const WEBP_QUALITY = 80;

async function optimizeImage(buffer: Buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Calculate the smallest dimension to create a square
  const size = Math.min(
    metadata.width || MAX_WIDTH,
    metadata.height || MAX_HEIGHT,
    MAX_WIDTH // Cap at maximum allowed size
  );

  return image
    .resize(size, size, {
      fit: "cover", // Crop to fill the square
      position: "center", // Center the crop
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

const app = new Hono()
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        image: z.custom<File>((val) => val instanceof File, {
          message: "Wymagany jest plik obrazu",
        }),
      })
    ),
    async (c) => {
      const { user } = await getCurrentSession();

      if (!user) {
        return c.json({ success: false, message: "Brak autoryzacji" }, 401);
      }

      try {
        await rateLimiter.consume(user.id);
      } catch {
        return c.json(
          { success: false, message: "Zbyt wiele żądań, spróbuj później" },
          429
        );
      }

      const formData = c.req.valid("form");

      // Pobranie pliku z FormData
      const file = formData.image;

      if (!file || !(file instanceof File)) {
        return c.json(
          { success: false, message: "Brak pliku lub nieprawidłowy format" },
          400
        );
      }

      // Sprawdzenie rozmiaru pliku
      if (file.size > MAX_FILE_SIZE) {
        return c.json({ success: false, message: "Plik jest zbyt duży" }, 400);
      }

      // Sprawdzenie typu pliku
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        return c.json(
          { success: false, message: "Nieprawidłowy format pliku" },
          400
        );
      }

      // Przesłanie pliku do serwera
      try {
        const fileId = uuid();
        const fileBuffer = await file.arrayBuffer();

        // Optimize the image
        const optimizedBuffer = await optimizeImage(Buffer.from(fileBuffer));

        await S3.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: fileId,
            Body: optimizedBuffer,
            ContentType: "image/webp",
          })
        );

        const imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileId}`;

        const imageBatch: ImageInsert = {
          id: fileId,
          key: fileId,
          mimeType: "image/webp",
          size: optimizedBuffer.length,
          url: imageUrl,
          uploadedBy: user.id,
        };

        await db.transaction(async (tx) => {
          await tx.insert(images).values(imageBatch);

          await tx
            .update(users)
            .set({
              image: imageUrl,
            })
            .where(eq(users.id, user.id));

          if (
            user.image &&
            user.image.startsWith(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!)
          ) {
            const oldImageId = user.image.replace(
              `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/`,
              ""
            );
            await S3.send(
              new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: oldImageId,
              })
            );
            await tx.delete(images).where(eq(images.id, oldImageId));
          }
        });

        return c.json({
          success: true,
          message: "Plik został przesłany pomyślnie",
          ...imageBatch,
        });
      } catch (error) {
        console.error("Upload error:", error);
        return c.json(
          { success: false, message: "Błąd podczas przesyłania pliku" },
          500
        );
      }
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { user } = await getCurrentSession();

      if (!user) {
        return c.json({ success: false, message: "Brak autoryzacji" }, 401);
      }

      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({
          success: false,
          message: "Nieprawidłowy identyfikator",
        });
      }

      try {
        const image = await db.query.images.findFirst({
          where: eq(images.id, id),
        });

        if (!image) {
          return c.json(
            { success: false, message: "Nie znaleziono pliku" },
            404
          );
        }

        if (image.uploadedBy !== user.id) {
          return c.json(
            { success: false, message: "Brak autoryzacji do usunięcia pliku" },
            401
          );
        }

        // Usunięcie z bazy danych
        db.transaction(async (tx) => {
          await tx.delete(images).where(eq(images.id, id));

          await tx.update(users).set({
            image: null,
          });

          // Usunięcie z R2
          await S3.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET,
              Key: image.key!,
            })
          );
        });

        return c.json(null, 203);
      } catch (error) {
        console.error("Delete error:", error);
        return c.json(
          { success: false, message: "Błąd podczas usuwania pliku" },
          500
        );
      }
    }
  );

export default app;
