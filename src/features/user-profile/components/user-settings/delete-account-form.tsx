"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import React from "react";
import { toast } from "sonner";

const DeleteAccountForm = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const { error } = await authClient.deleteUser({
      callbackURL: "/goodbye",
    });

    if (error) {
      toast.error(error.code ? getErrorMessage(error.code) : error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsOpen(false);
    toast.success(
      "Na twój adres e-mail zostało wysłane potwierdzenie usunięcia konta."
    );
  };
  return (
    <div className="p-6 rounded-lg border flex flex-col items-end gap-4">
      <p className="text-sm text-muted-foreground">
        Usunięcie konta jest nieodwracalne. Wszystkie dane użytkownika zostaną
        trwale usunięte z naszych serwerów.
      </p>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Usuń konto</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń konto</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć swoje konto? Wszystkie dane zostaną
              trwale usunięte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Anuluj</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              Usuń konto
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccountForm;
