import FacetedSearch from "@/components/facated-search/faceted-search";
import SortButton from "@/components/sort-button";
import React from "react";
import { db } from "@/lib/db";
import EmptyState from "@/components/empty-state";
import RecipesHero from "@/components/recipes-hero";
import {
  HorizontalCard,
  HorizontalCardType,
} from "@/components/cards/horizontal-card";
import FacetedSearchSeet from "@/components/facated-search/faceted-search-sheet";
import SectionWrapper from "@/components/section-wrapper";

interface SearchPageProps {
  searchParams?: {
    orderBy?: "asc" | "desc";
    page?: string;
    categories?: string;
    occasions?: string;
    cuisines?: string;
    diets?: string;
    q: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const searchQuery = searchParams?.q;

  const categories = searchParams?.categories?.split(",");
  const occasions = searchParams?.occasions?.split(",");
  const cuisines = searchParams?.cuisines?.split(",");
  const diets = searchParams?.diets?.split(",");

  const createFilter = (key: string, values: string | string[] | undefined) => {
    if (!values) return undefined;
    const inValues = Array.isArray(values) ? values : values.split(",");
    return {
      some: {
        [key]: {
          slug: {
            in: inValues,
          },
        },
      },
    };
  };

  const recipes = await db.recipe.findMany({
    where: {
      published: true,
      name: {
        search: searchQuery,
      },
      category: {
        slug: {
          in: categories,
        },
      },
      occasions: createFilter("occasion", searchParams?.occasions),
      cuisines: createFilter("cuisines", searchParams?.cuisines),
      diets: createFilter("diet", searchParams?.diets),
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  console.log(recipes);

  return (
    <div className="space-y-6">
      {searchQuery && (
        <RecipesHero headline="Wyniki wyszukiwania dla" heading={searchQuery} />
      )}
      <div className="flex gap-x-4">
        <SectionWrapper className="flex-1 h-fit">
          <RecipesHeader />
          {!!recipes.length && <RecipesFeed recipes={recipes} />}
          {!recipes.length && (
            <EmptyState
              heading="Nie znaleziono przepisów"
              description="Spróbuj zmienić kryteria wyszukiwania lub dodaj własny przepis"
              buttonLabel="Dodaj przepis"
            />
          )}
        </SectionWrapper>
        <aside className="w-full lg:w-[300px] hidden lg:flex rounded-xl p-6 bg-white h-fit">
          <FacetedSearch />
        </aside>
      </div>
    </div>
  );
};

const RecipesHeader = () => {
  return (
    <header className="flex justify-between mb-8 flex-col items-start space-y-3 sm:flex-row sm:items-center">
      <h1 className="font-display text-3xl lg:text-4xl">Przepisy</h1>
      <div className="flex space-x-2">
        <SortButton />
        <FacetedSearchSeet className="lg:hidden" />
      </div>
    </header>
  );
};

const RecipesFeed = ({ recipes }: { recipes: HorizontalCardType[] }) => {
  return (
    <div className="grid gap-8 lg:gap-6">
      {recipes.map((recipe) => (
        <HorizontalCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default SearchPage;
