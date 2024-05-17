import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const recipes = await db.query.recipe.findMany();

  return NextResponse.json(recipes);
};
