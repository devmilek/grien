"use client";

import { queryClient } from "@/components/providers/query-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { honoClient } from "@/lib/hono-client";
import { getInitials } from "@/utils";
import { pluralizeRecipes } from "@/utils/pluralize-words";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export const CollectionTile = ({
  id,
  name,
  count,
  checked,
  recipeId,
}: {
  id: string;
  name: string;
  count: number;
  checked?: boolean;
  recipeId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    try {
      setIsLoading(true);

      if (checked) {
        const res = await honoClient.api.collections[":collectionId"].recipes[
          ":recipeId"
        ].$delete({
          param: {
            collectionId: id,
            recipeId: recipeId,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message);
        }

        const data = await res.json();
        toast.success(data.message);
      } else {
        const res = await honoClient.api.collections[":collectionId"].recipes[
          ":recipeId"
        ].$post({
          param: {
            collectionId: id,
            recipeId: recipeId,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message);
        }

        const data = await res.json();
        toast.success(data.message);
      }

      queryClient.invalidateQueries({
        queryKey: ["collections", recipeId],
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Wystąpił błąd");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex gap-4 items-center p-2 rounded-lg hover:bg-accent pr-5"
      onClick={handleSelect}
    >
      <div className="size-14 bg-emerald-50 flex items-center justify-center rounded-md text-primary uppercase font-semibold">
        {getInitials(name)}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-sm text-muted-foreground">
          {count} {pluralizeRecipes(count)}
        </p>
      </div>
      {isLoading ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <Checkbox checked={checked} />
      )}
    </div>
  );
};

export default CollectionTile;
