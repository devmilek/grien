"use server";

import { v2 as cloudinary } from "cloudinary";

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME!;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
const apiSecret = process.env.CLOUDINARY_API_SECRET!;

//@ts-ignore
const cloudinaryConfig: CloudinaryConfig = cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

interface SignatureResponse {
  timestamp: number;
  signature: string;
}

export async function getSignature(): Promise<SignatureResponse> {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "grien" },
    cloudinaryConfig.api_secret,
  );

  return { timestamp, signature };
}

interface SaveToDatabaseParams {
  public_id: string;
  version: string;
  signature: string;
}

export async function saveToDatabase({
  public_id,
  version,
  signature,
}: SaveToDatabaseParams): Promise<void> {
  // verify the data
  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id, version },
    cloudinaryConfig.api_secret,
  );

  if (expectedSignature === signature) {
    // safe to write to database
    console.log({ public_id, version, signature });
  }
}

export const deleteImage = async (public_id: string) => {
  await cloudinary.uploader.destroy(public_id, {
    invalidate: true,
    resource_type: "image",
  });
};
