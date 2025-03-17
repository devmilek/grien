"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";
import React from "react";
import CreateCollectionForm from "../forms/create-collection-form";

const CreateCollectionPopover = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover modal={true} open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <PlusIcon />
          Utwórz kolekcję
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <CreateCollectionForm
          onSubmit={() => {
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CreateCollectionPopover;
