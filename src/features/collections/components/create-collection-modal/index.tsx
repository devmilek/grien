"use client";

import React from "react";
import CreateCollectionForm from "../forms/create-collection-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateCollectionModal = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Utwórz kolekcję</DialogTitle>
          <DialogDescription>
            Utwórz nową kolekcję, aby zorganizować swoje przepisy.
          </DialogDescription>
        </DialogHeader>
        <CreateCollectionForm
          onSubmit={() => {
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionModal;
