"use server";

import db from "@/db";

export const getCategories = async () => {
  const data = await db.query.categories.findMany();

  return data;
};

export const getCuisines = async () => {
  const data = await db.query.cuisines.findMany();

  return data;
};

export const getOccasions = async () => {
  const data = await db.query.occasions.findMany();

  return data;
};

export const getDiets = async () => {
  const data = await db.query.categories.findMany();

  return data;
};
