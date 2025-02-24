"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { getRecipesText } from "@/utils";
import React from "react";

export const CollectionTile = ({
  name,
  count,
  checked,
  onSelect,
}: {
  name: string;
  count: number;
  checked?: boolean;
  onSelect?: () => void;
}) => {
  return (
    <div
      className="flex gap-4 items-center p-2 rounded-lg hover:bg-accent pr-5"
      onClick={onSelect}
    >
      <div className="size-14 bg-emerald-50 flex items-center justify-center rounded-md text-primary uppercase font-semibold">
        {name[0]}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-sm text-muted-foreground">
          {count} {getRecipesText(count)}
        </p>
      </div>
      <Checkbox checked={checked} />
    </div>
  );
};

export default CollectionTile;
