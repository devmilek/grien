import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";
import React from "react";
import FacatedSearch from ".";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MobileFacatedSearch = ({ className }: { className?: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <FilterIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <DialogHeader className="sr-only">
          <DialogTitle>Filtruj przepisy</DialogTitle>
          <DialogDescription>
            Wybierz kategorie, kuchnie, diety i okazje
          </DialogDescription>
        </DialogHeader>
        <FacatedSearch />
      </SheetContent>
    </Sheet>
  );
};

export default MobileFacatedSearch;
