"use server";

import { getCurrentSession } from "@/lib/auth/utils";
import { S3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export const uploadAvatar = async (formData: FormData) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      status: 401,
      message: "Musisz być zalogowany, aby przesłać zdjęcie",
    };
  }

  const file = formData.get("image") as File;

  if (!file) {
    return {
      status: 400,
      message: "Nie znaleziono pliku",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      status: 400,
      message: "Plik jest zbyt duży",
    };
  }

  if (
    !["image/png", "image/jpeg", "image/avif", "image/webp"].includes(file.type)
  ) {
    return {
      status: 400,
      message: "Nieobsługiwany format pliku",
    };
  }

  const fileId = uuid();
  const fileBuffer = await file.arrayBuffer();

  const uint8Array = new Uint8Array(fileBuffer);

  await S3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileId,
      Body: uint8Array,
      ContentType: file.type,
    })
  );

  const imageSrc = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileId}`;

  console.log(`Uploaded file ${fileId}`);

  return {
    status: 200,
    data: {
      id: fileId,
      src: imageSrc,
    },
  };
};
