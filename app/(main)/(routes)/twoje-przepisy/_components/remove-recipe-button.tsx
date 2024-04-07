"use client";

import { deleteRecipe } from "@/actions/recipe-creation/delete-recipe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const RemoveRecipeButton = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteRecipe(id);
      router.refresh();
      toast.success("Pomyślnie usunięto przepis");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się usunąć przepisu");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl">
            Napewno chcesz usunąć przepis?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja jest nieodwracalna. Spowoduje to trwałe usunięcie tego
            przepsu z naszych serwerów.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Anuluj</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              Usuń
            </Button>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveRecipeButton;
