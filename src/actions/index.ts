"use server";

import db from "@/db";

export const getCategories = async () => {
  const data = await db.query.categories.findMany();

  return data;
};
