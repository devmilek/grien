"use server";

import db from "@/db";
import { images } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import { S3 } from "@/lib/s3";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/avif",
  "image/webp",
];

// Maximum dimensions for optimization
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const WEBP_QUALITY = 80;

async function optimizeImage(buffer: Buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Calculate new dimensions while maintaining aspect ratio
  let width = metadata.width || 0;
  let height = metadata.height || 0;

  if (width > MAX_WIDTH) {
    height = Math.round((height * MAX_WIDTH) / width);
    width = MAX_WIDTH;
  }

  if (height > MAX_HEIGHT) {
    width = Math.round((width * MAX_HEIGHT) / height);
    height = MAX_HEIGHT;
  }

  return image
    .resize(width, height, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const { user } = await getCurrentSession();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const file = formData.get("file") as File;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return new Response("Invalid file type", { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return new Response("File is too large", { status: 400 });
  }

  try {
    const fileId = uuid();
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${fileId}.webp`;

    // Optimize the image
    const optimizedBuffer = await optimizeImage(Buffer.from(fileBuffer));

    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: fileName,
        Body: optimizedBuffer,
        ContentType: "image/webp",
      })
    );

    const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    await db.insert(images).values({
      id: fileId,
      key: fileName,
      mimeType: "image/webp",
      size: optimizedBuffer.length,
      url: imageUrl,
      uploadedBy: user.id,
    });

    return Response.json({
      url: imageUrl,
      id: fileId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response("Error uploading file", { status: 500 });
  }
}
