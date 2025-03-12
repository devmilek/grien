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
            cuisineSlugs:
              cuisineSlugs?.join(",") || cuisineSlugsParam?.join(","),
            dietSlugs: dietsSlugs?.join(",") || dietsSlugsParam?.join(","),
            occassionSlugs:
              occassionsSlug?.join(",") || occassionSlugParam?.join(","),
            query,
            page: pageParam,
          },
        });

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
