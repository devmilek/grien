import { Checkbox } from "@/components/ui/checkbox";
import { getRecipesText } from "@/utils";
import { HeartIcon } from "lucide-react";
import React from "react";

const FavourtieCollectionTile = ({
  count,
  checked,
  onSelect,
}: {
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
        <HeartIcon className="fill-primary text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">Polubione przepisy</p>
        <p className="text-sm text-muted-foreground">
          {count} {getRecipesText(count)}
        </p>
      </div>
      <Checkbox checked={checked} />
    </div>
  );
};

export default FavourtieCollectionTile;
