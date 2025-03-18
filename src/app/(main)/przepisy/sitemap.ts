import db from "@/db";
import { recipes } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipesData = await db.query.recipes.findMany({
    where: eq(recipes.status, "published"),
  });

  const recipesUrls = recipesData.map((recipe) => ({
    url: `${BASE_URL}/przepisy/${recipe.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...recipesUrls];
}
