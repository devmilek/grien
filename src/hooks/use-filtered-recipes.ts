import { RecipeForCard } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface FilteredRecipesParams {
  categorySlug?: string | null;
  cuisineSlugs?: string[];
  occassionSlugs?: string[];
  dietSlugs?: string[];
  query?: string | null;
  page?: number;
}

export const useFilteredRecipes = ({
  categorySlug,
  cuisineSlugs,
  dietSlugs,
  occassionSlugs,
  page,
  query,
}: FilteredRecipesParams) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "recipes",
        {
          categorySlug,
          cuisineSlugs,
          dietSlugs,
          occassionSlugs,
          page,
          query,
        },
      ],
      queryFn: async () => {
        const res = await axios.get(`/api/recipes`, {
          params: {
            categorySlug,
            cuisineSlugs,
            dietSlugs,
            occassionSlugs,
            page,
            query,
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
