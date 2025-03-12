"use client";

import { Accordion } from "@/components/ui/accordion";
import React from "react";
import { useAttributes } from "@/hooks/use-attributes";
import FacatedListItem from "./facated-list-item";
import FacatedCategoriesItem from "./facated-categories-item";
import FacatedDifficultyItem from "./facated-difficulty-item";

export interface FacatedSearchProps {
  showCategories?: boolean;
  showCuisines?: boolean;
  showOccasions?: boolean;
  showDiets?: boolean;
  showDifficulties?: boolean;
}

const FacatedSearch = ({
  showCategories = true,
  showCuisines = true,
  showOccasions = true,
  showDiets = true,
  showDifficulties = true,
}: FacatedSearchProps) => {
  const { data } = useAttributes();

  return (
    <div className="bg-white rounded-xl p-6 py-3">
      <Accordion type="multiple" defaultValue={["kategorie"]}>
        {showCategories && <FacatedCategoriesItem items={data?.categories} />}
        {showCuisines && (
          <FacatedListItem
            title="Kuchnie świata"
            items={data?.cuisines}
            value="kuchnie"
          />
        )}
        {showOccasions && (
          <FacatedListItem
            title="Okazje"
            items={data?.occasions}
            value="okazje"
          />
        )}
        {showDiets && (
          <FacatedListItem title="Diety" items={data?.diets} value="diety" />
        )}
        {showDifficulties && <FacatedDifficultyItem />}
      </Accordion>
    </div>
  );
};

export default FacatedSearch;
