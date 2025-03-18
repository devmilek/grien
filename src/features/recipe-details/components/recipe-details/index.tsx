import { TooltipProvider } from "@/components/ui/tooltip";
import db from "@/db";
import { recipes } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";
import RecipeImage from "./recipe-image";
import RecipeHeader from "./recipe-header";
import RecipeAttributes from "./recipe-attributes";
import RecipeActions from "./recipe-actions";
import IngredientsList from "./ingredients-list";
import StepsList from "./steps-list";
import RecipeLicence from "./recipe-licence";
import CommentsCard from "@/features/comments/components/comments-card";
import { RecipeDetailsProvider } from "../../context/use-recipe-details-context";
import { Recipe, WithContext } from "schema-dts";

const RecipeDetails = async ({ slug }: { slug: string }) => {
  const { user } = await getCurrentSession();
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.slug, slug),
    with: {
      image: {
        columns: {
          url: true,
        },
      },
      user: true,
      ingredients: true,
      category: true,
      steps: {
        with: {
          image: true,
        },
      },
      licence: true,
      attributes: {
        with: {
          attribute: true,
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  if (recipe.status !== "published" && recipe.user.id !== user?.id) {
    notFound();
  }

  const jsonLd: WithContext<Recipe> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    image: recipe.image?.url,
    description: recipe.description,
    author: {
      "@type": "Person",
      name: recipe.user.name,
    },
    license: recipe.licence?.licenseType,
    recipeCategory: recipe.category.name,
    recipeCuisine: recipe.attributes.find(
      (attr) => attr.attribute.type === "cuisines"
    )?.attribute.name,
    recipeIngredient: recipe.ingredients.map(
      (ingredient) =>
        `${ingredient.name} ${ingredient.amount} ${ingredient.unit}`
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      "@type": "HowToStep",
      text: step.content,
      image: step.image?.url,
    })),
    recipeYield: recipe.portions + " porcje",
  };

  return (
    <>
      <RecipeDetailsProvider recipe={recipe}>
        <div className="mx-auto container">
          {/* hero */}
          <TooltipProvider>
            <section className="grid gap-4 lg:grid-cols-2 lg:gap-8 md:min-h-96 bg-white rounded-xl p-4 md:p-6">
              <RecipeImage />
              <div className="flex flex-col">
                <div className="flex-1">
                  <RecipeHeader
                    name={recipe.name}
                    createdAt={recipe.createdAt}
                    author={{
                      name: recipe.user.name,
                      username: recipe.user.username,
                    }}
                  />
                  {/* ATTRIBUTES */}
                  <RecipeAttributes
                    attributes={recipe.attributes}
                    category={recipe.category}
                    difficulty={recipe.difficulty}
                    portions={recipe.portions}
                    preparationTime={recipe.preparationTime}
                    views={recipe.views}
                  />
                  {/* DESC */}
                  <p className="text-muted-foreground text-sm mt-4">
                    {recipe.description}
                  </p>
                </div>
                <RecipeActions userId={user?.id} />
              </div>
            </section>
          </TooltipProvider>
          {/* LAYOUT */}
          <div className="flex gap-6 mt-6 flex-col lg:flex-row">
            <div className="lg:w-[380px]">
              <IngredientsList
                ingredients={recipe.ingredients}
                portions={recipe.portions}
              />
            </div>
            <div className="flex-1 space-y-8">
              <StepsList steps={recipe.steps} />
              {recipe.licence && <RecipeLicence licence={recipe.licence} />}
              <CommentsCard recipeId={recipe.id} />
            </div>
          </div>
        </div>
      </RecipeDetailsProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default RecipeDetails;
