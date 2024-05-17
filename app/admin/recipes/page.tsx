import React from "react";
import { DataTable } from "./data-table";
import { db } from "@/lib/db";
import ImportRecipeButton from "../_components/import-recipe-button";

const RecipePage = async () => {
  const recipes = await db.query.recipe.findMany();
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <ImportRecipeButton />
      </div>
      <DataTable data={recipes} />
    </div>
  );
};

export default RecipePage;
