import db from "@/db";
import { images } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { S3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const { user } = await getCurrentSession();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!id) {
    return new Response("Bad request", { status: 400 });
  }

  try {
    const image = await db.query.images.findFirst({
      where: eq(images.id, id),
    });

    if (!image) {
      return new Response("Not found", { status: 404 });
    }

    if (image.uploadedBy !== user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete from R2
    await S3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: image.key,
      })
    );

    // Delete from database
    await db.delete(images).where(eq(images.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response("Error deleting image", { status: 500 });
  }
}
