import { RecipeForCard } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRecipesFilters } from "./use-recipes-filters";

export interface UseFilteredRecipesProps {
  categorySlug?: string;
  cuisineSlugs?: string[];
  dietsSlugs?: string[];
  occassionsSlug?: string[];
}

export const useFilteredRecipes = ({
  categorySlug,
  cuisineSlugs,
  dietsSlugs,
  occassionsSlug,
}: UseFilteredRecipesProps) => {
  const {
    categorySlug: categorySlugParam,
    cuisineSlugs: cuisineSlugsParam,
    dietSlugs: dietsSlugsParam,
    occassionSlugs: occassionSlugParam,
    query,
  } = useRecipesFilters();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "recipes",
        {
          categorySlug: categorySlug || categorySlugParam,
          cuisineSlugs: cuisineSlugs || cuisineSlugsParam,
          dietSlugs: dietsSlugs || dietsSlugsParam,
          occassionSlugs: occassionsSlug || occassionSlugParam,
          query,
        },
      ],
      queryFn: async ({ pageParam }) => {
        const res = await axios.get(`/api/recipes`, {
          params: {
            categorySlug: categorySlug || categorySlugParam,
            cuisineSlugs: cuisineSlugs || cuisineSlugsParam,
            dietSlugs: dietsSlugs || dietsSlugsParam,
            occassionSlugs: occassionsSlug || occassionSlugParam,
            query,
            page: pageParam,
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return res.data as RecipeForCard[];
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  return { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
