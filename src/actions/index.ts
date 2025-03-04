"use server";

import db from "@/db";

export const getCategories = async () => {
  const data = await db.query.categories.findMany();

  return data;
};

export const getAttributes = async () => {
  const data = await db.query.attributes.findMany();
  const categories = await db.query.categories.findMany();

  const cuisines = data.filter((item) => item.type === "cuisines");
  const diets = data.filter((item) => item.type === "diets");
  const occasions = data.filter((item) => item.type === "occasions");

  return {
    cuisines,
    diets,
    occasions,
    categories,
  };
};
