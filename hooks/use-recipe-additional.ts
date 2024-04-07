import {
  addRecipeCuisine,
  addRecipeDiet,
  addRecipeOccasion,
  getRecipeCuisines,
  getRecipeDiets,
  getRecipeOccasions,
  removeRecipeCuisine,
  removeRecipeOccasion,
} from "@/actions/recipe-creation/recipe-additional";
import { AdditionalItem } from "@/app/(main)/(routes)/utworz-przepis/_components/additional/additional-select";
import { useUtilityData } from "@/components/providers/utility-data-provider";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

export const useRecipeAdditional = (recipeId: string) => {
  const { mutate } = useSWRConfig();
  const { cuisines, diets, occasions } = useUtilityData();

  const occassionsKey = recipeId + "-occassions";
  const cuisinesKey = recipeId + "-cuisines";
  const dietsKey = recipeId + "-diets";

  const { data: selectedOccasions, isLoading: isOccasionsLoading } = useSWR(
    occassionsKey,
    () => getRecipeOccasions(recipeId),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: selectedCuisines, isLoading: isCuisinesLoading } = useSWR(
    cuisinesKey,
    () => getRecipeCuisines(recipeId),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: selectedDiets, isLoading: isDietsLoading } = useSWR(
    dietsKey,
    () => getRecipeDiets(recipeId),
    {
      revalidateOnFocus: false,
    },
  );

  const unselectedCuisines = useMemo(
    () =>
      cuisines?.filter(
        (cuisine) =>
          !selectedCuisines?.some(
            (selectedCuisine) => selectedCuisine.id === cuisine.id,
          ),
      ),
    [selectedCuisines, cuisines],
  );

  const unselectedOccasions = useMemo(
    () =>
      occasions?.filter(
        (occasion) =>
          !selectedOccasions?.some(
            (selectedOccasion) => selectedOccasion.id === occasion.id,
          ),
      ),
    [selectedOccasions, occasions],
  );

  const unselectedDiets = useMemo(
    () =>
      diets?.filter(
        (diet) =>
          !selectedDiets?.some((selectedDiet) => selectedDiet.id === diet.id),
      ),
    [selectedDiets, diets],
  );

  const addMutation = async (
    key: string,
    itemId: string,
    addFn: (itemId: string, recipeId: string) => Promise<void>,
    items?: AdditionalItem[],
    selectedItems?: AdditionalItem[],
  ) => {
    if (selectedItems?.some((item) => item.id === itemId)) {
      return toast.error("Ten element jest już dodany");
    }

    const optimisticItem = items?.find((item) => item.id === itemId);

    toast.promise(
      mutate(
        key,
        async () => {
          await addFn(itemId, recipeId);
          return [optimisticItem, ...(selectedItems || [])];
        },
        {
          revalidate: false,
          optimisticData: [optimisticItem, ...(selectedItems || [])],
        },
      ),
      {
        loading: "Dodawanie...",
        success: "Dodano!",
        error: "Dodawanie nie powiodło się",
      },
    );
  };

  const removeMutation = (
    key: string,
    itemId: string,
    removeFn: (itemId: string, recipeId: string) => Promise<void>,
    selectedItems?: AdditionalItem[],
  ) => {
    const optimisticItems = selectedItems?.filter((item) => item.id !== itemId);

    const toastPromise = mutate(
      key,
      async () => {
        await removeFn(itemId, recipeId);
        return optimisticItems;
      },
      {
        revalidate: false,
        optimisticData: optimisticItems,
      },
    );

    toast.promise(toastPromise, {
      loading: "Usuwanie...",
      success: "Usunięto!",
      error: "Dodawananie nie powiodło się",
    });
  };

  const addOccasionMutation = async (occasionId: string) => {
    addMutation(
      occassionsKey,
      occasionId,
      addRecipeOccasion,
      unselectedOccasions,
      selectedOccasions,
    );
  };

  const removeOccasionMutation = async (occasionId: string) => {
    removeMutation(
      occassionsKey,
      occasionId,
      removeRecipeOccasion,
      selectedOccasions,
    );
  };

  const addCuisineMutation = async (cuisineId: string) => {
    addMutation(
      cuisinesKey,
      cuisineId,
      addRecipeCuisine,
      unselectedCuisines,
      selectedCuisines,
    );
  };

  const removeCuisineMutation = async (cuisineId: string) => {
    removeMutation(
      cuisinesKey,
      cuisineId,
      removeRecipeCuisine,
      selectedCuisines,
    );
  };

  const addDietMutation = async (dietId: string) => {
    addMutation(
      dietsKey,
      dietId,
      addRecipeDiet,
      unselectedDiets,
      selectedDiets,
    );
  };

  const removeDietMutation = async (dietId: string) => {
    removeMutation(dietsKey, dietId, removeDietMutation, selectedDiets);
  };

  return {
    isCuisinesLoading,
    selectedCuisines,
    unselectedCuisines,
    addCuisineMutation,
    removeCuisineMutation,

    isOccasionsLoading,
    selectedOccasions,
    unselectedOccasions,
    addOccasionMutation,
    removeOccasionMutation,

    isDietsLoading,
    selectedDiets,
    unselectedDiets,
    addDietMutation,
    removeDietMutation,
  };
};
