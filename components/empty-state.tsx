import { DrumstickIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

interface EmptyStateProps {
  heading?: string;
  description?: string;
  buttonLabel?: string;
}

const EmptyState = ({
  heading = "Nie znaleziono przepisów",
  description = "Spróbuj zmienić kryteria wyszukiwania lub dodaj własny przepis",
  buttonLabel = "Dodaj przepis",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center">
      <DrumstickIcon className="text-emerald-600 h-10 w-10" />
      <h1 className="mt-4 mb-1 font-medium">{heading}</h1>
      <p className="text-muted-foreground text-sm text-center">{description}</p>
      <Button asChild className="mt-4">
        <Link href={ROUTES.createRecipe}>{buttonLabel}</Link>
      </Button>
    </div>
  );
};

export default EmptyState;
