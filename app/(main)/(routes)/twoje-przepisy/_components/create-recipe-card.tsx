"use client";

import { seedUtilityData } from "@/actions/seed-db";
import { seedDb } from "@/actions/seed-from-json";
import { ROUTES } from "@/config";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const CreateRecipeCard = ({ className }: { className?: string }) => {
  return (
    <div
      // href={ROUTES.createRecipe}
      className={cn(
        "p-6 rounded-xl bg-white border flex items-center cursor-pointer",
        className,
      )}
    >
      <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-700 mr-3">
        <PlusIcon className="w-4 h-4" />
      </div>
      <div>
        <h2 className="font-display text-lg">Stwórz nowy przepis</h2>
        <p className="text-sm text-neutral-500">
          Podziel się z innymi twoim talentem.
        </p>
      </div>
      <button
        onClick={async () => {
          await seedUtilityData();
          // await seedAiUser();
          // await seedRecipes();
          toast.success("Seeded db");
        }}
      >
        import
      </button>
    </div>
  );
};

export default CreateRecipeCard;
