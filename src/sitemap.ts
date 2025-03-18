import type { MetadataRoute } from "next";
import db from "./db";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await db.query.categories.findMany();
  const attributes = await db.query.attributes.findMany();

  const categoriesUrls = categories.map((category) => ({
    url: `${BASE_URL}/kategorie/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const cuisines = attributes.filter((attr) => attr.type === "cuisines");
  const diets = attributes.filter((attr) => attr.type === "diets");
  const occasions = attributes.filter((attr) => attr.type === "occasions");

  const attributesUrls = [
    ...cuisines.map((attr) => ({
      url: `${BASE_URL}/kuchnie-swiata/${attr.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...diets.map((attr) => ({
      url: `${BASE_URL}/diety/${attr.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...occasions.map((attr) => ({
      url: `${BASE_URL}/okazje/${attr.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categoriesUrls,
    ...attributesUrls,
  ];
}
