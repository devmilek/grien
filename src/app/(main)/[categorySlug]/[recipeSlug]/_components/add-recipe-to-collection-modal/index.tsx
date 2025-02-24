"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bookmark } from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateCollectionPopover from "./create-collection-popover";
import { useQuery } from "@tanstack/react-query";
import { getUserCollections } from "./actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  addRecipeToCollections,
  toggleFavouriteRecipe,
} from "@/actions/collections-recipes";
import CollectionTile from "./collection-tile";
import FavourtieCollectionTile from "./favourite-collection-tile";
import { Separator } from "@/components/ui/separator";

const AddRecipeToCollectionModal = ({ recipeId }: { recipeId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isFavourite, setIsFavourite] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => await getUserCollections({ recipeId }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (data) {
      setSelectedCollections(data.recipesSavedInCollections);
      setIsFavourite(data.isFavourite);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleFavourite = async () => {
    const { message, status } = await toggleFavouriteRecipe(
      recipeId,
      isFavourite
    );

    if (status !== 200) {
      toast.error(message);
    }
  };

  const handleSave = async () => {
    await handleFavourite();
    const { message, status } = await addRecipeToCollections(
      recipeId,
      selectedCollections
    );

    if (status === 200) {
      toast.success(message);
      setIsOpen(false);
    } else {
      toast.error(message);
    }
  };

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
          {data && (
            <div>
              <FavourtieCollectionTile
                count={data.favouritesCount}
                checked={isFavourite}
                onSelect={() => setIsFavourite(!isFavourite)}
              />
              <Separator className="my-3" />
              {data.collections.map((collection) => (
                <CollectionTile
                  key={collection.id}
                  name={collection.name}
                  count={collection.recipesCount}
                  checked={selectedCollections.includes(collection.id)}
                  onSelect={() => {
                    if (selectedCollections.includes(collection.id)) {
                      setSelectedCollections(
                        selectedCollections.filter((id) => id !== collection.id)
                      );
                    } else {
                      setSelectedCollections([
                        ...selectedCollections,
                        collection.id,
                      ]);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <CreateCollectionPopover />
          <Button onClick={handleSave}>Gotowe</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeToCollectionModal;
