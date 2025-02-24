"use client";

import { getFilteredRecipes } from "@/actions/get-filtered-recipes";
import HorizontalCard from "@/components/cards/horizontal-card";
import { useQuery } from "@tanstack/react-query";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import React from "react";

const RecipesFeed = ({ query }: { query: string | null }) => {
  const [categorySlug] = useQueryState("kategoria", parseAsString);
  const [cuisineSlugs] = useQueryState(
    "kuchnie",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [occassionSlugs] = useQueryState(
    "okazje",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [dietSlugs] = useQueryState(
    "diety",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const { data } = useQuery({
    queryKey: [
      "recipes",
      {
        categorySlug,
        cuisineSlugs,
        occassionSlugs,
        dietSlugs,
        query,
      },
    ],
    queryFn: async () =>
      getFilteredRecipes({
        categorySlug,
        cuisineSlugs,
        dietSlugs,
        occassionSlugs,
        query,
      }),
  });
  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="text-3xl font-display">Wyniki ({data?.length})</h2>
      <div className="space-y-4 mt-4">
        {data?.map((recipe) => (
          <HorizontalCard
            key={recipe.id}
            author={recipe.user}
            category={recipe.category}
            categorySlug={recipe.categorySlug}
            description={recipe.description}
            id={recipe.id}
            name={recipe.name}
            slug={recipe.slug}
            src={recipe.image}
            licence={recipe.licence}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipesFeed;
