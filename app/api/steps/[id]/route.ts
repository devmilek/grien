import { db } from "@/lib/db";
import { preparationStep } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  const steps = await db.query.preparationStep.findMany({
    where: eq(preparationStep.recipeId, id),
  });

  return NextResponse.json(steps);
};
