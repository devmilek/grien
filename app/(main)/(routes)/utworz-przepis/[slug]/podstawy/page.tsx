import React from "react";
import Navigator from "../navigator";
import EditBasicForm from "../../edit-basic-form";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { recipe as OrmRecipe } from "@/lib/db/schema";

const EditBasicPage = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const recipe = await db.query.recipe.findFirst({
    where: eq(OrmRecipe.slug, params.slug),
  });

  console.log(recipe);

  return (
    <div className="">
      <EditBasicForm recipe={recipe} />
    </div>
  );
};

export default EditBasicPage;
