"use server";

import db from "@/db";

export const getCategories = async () => {
  const data = await db.query.categories.findMany();

  return data;
};

export const getAttributes = async () => {
  const data = await db.query.attributes.findMany();

  return data;
};
