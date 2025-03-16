import db from "@/db";
import { User } from ".";
import { S3 } from "../s3";
import { eq } from "drizzle-orm";
import { images, recipes, comments } from "@/db/schema";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export const cleanupAfterUserDelete = async (user: User) => {
  try {
    // Fetch all images uploaded by the user
    const userImages = await db.query.images.findMany({
      where: eq(images.uploadedBy, user.id),
    });

    // Delete images from S3/R2 storage
    if (userImages.length > 0) {
      // Create array of objects to delete in correct format
      const objectsToDelete = userImages.map((image) => ({
        Key: image.key,
      }));

      // Execute deletion
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME || "grien",
        Delete: {
          Objects: objectsToDelete,
        },
      });

      await S3.send(deleteCommand);
    }

    // Delete related database records in the correct order
    // Delete user's comments
    await db.delete(comments).where(eq(comments.userId, user.id));

    // Delete user's recipes
    await db.delete(recipes).where(eq(recipes.userId, user.id));

    // Delete user's images from database
    await db.delete(images).where(eq(images.uploadedBy, user.id));

    console.log(`Cleanup completed for user ${user.id}`);
    return { success: true };
  } catch (error) {
    console.error("Error during user cleanup:", error);
    return { success: false, error };
  }
};
