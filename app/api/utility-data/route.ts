import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // const [categories, occasions, cuisines, diets] = await db.$transaction([
    //   db.category.findMany(),
    //   db.occasion.findMany(),
    //   db.cuisine.findMany(),
    //   db.diet.findMany(),
    // ]);

    const [categories, attributes] = await Promise.all([
      db.query.category.findMany(),
      db.query.recipeAttribute.findMany(),
    ]);

    console.log("Fetched utility data from api route");

    return NextResponse.json({
      categories,
      attributes,
    });
  } catch (e) {
    console.log(e);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
