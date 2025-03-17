"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bookmark } from "lucide-react";
import React, { useState } from "react";
import CreateCollectionPopover from "./create-collection-popover";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import CollectionTile from "./collection-tile";
import { honoClient } from "@/lib/hono-client";

const AddRecipeToCollectionModal = ({ recipeId }: { recipeId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["collections", recipeId],
    queryFn: async () => {
      const res = await honoClient.api.collections.$get({
        query: {
          containsRecipe: recipeId,
        },
      });

      if (!res.ok) {
        throw new Error("Nie udało się pobrać kolekcji");
      }

      return await res.json();
    },
    enabled: isOpen,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        setIsOpen(val);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Bookmark />
          <span className="lg:hidden xl:inline-block">Zapisz</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zapisz przepis</DialogTitle>
          <DialogDescription>
            Wybierz kolekcję, do której chcesz zapisać przepis lub zapisz w
            polubionych
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80">
          {data?.data.map((collection) => (
            <CollectionTile
              key={collection.id}
              name={collection.name}
              count={collection.count}
              checked={collection.containsRecipe}
              id={collection.id}
              recipeId={recipeId}
            />
          ))}
        </ScrollArea>
        <DialogFooter>
          <CreateCollectionPopover />
          <DialogClose asChild>
            <Button>Gotowe</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeToCollectionModal;
