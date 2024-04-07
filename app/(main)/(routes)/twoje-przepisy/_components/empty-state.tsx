import React from "react";
import { CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = () => {
  return (
    <div className="flex items-center justify-center flex-col py-8 bg-white rounded-xl">
      <CookingPot className="h-12 w-12 text-muted-foreground" />
      <h1 className="font-display text-xl mt-4">Brak przepisów</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-3">
        Nie utworzyłeś jeszcze żadnych przepisów
      </p>
      <Button>Utwórz przepis</Button>
    </div>
  );
};

export default EmptyState;
