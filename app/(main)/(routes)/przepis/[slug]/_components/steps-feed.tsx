import { getIngredients, getSteps } from "@/data";
import { db } from "@/lib/db";
import { cn, delay } from "@/lib/utils";
import { PreparationStep } from "@prisma/client";
import Image from "next/image";
import React from "react";

const StepsFeed = async ({ recipeId }: { recipeId: number }) => {
  const steps = await getSteps(recipeId);

  return (
    <div className="bg-white px-8 rounded-xl w-full">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "flex items-center space-x-6 py-10",
            index !== steps.length - 1 && "border-b",
          )}
        >
          <div className="w-full">
            <h2 className="font-display text-2xl">Krok {index + 1}</h2>
            <p className="mt-2 text-neutral-500 text-sm">{step.description}</p>
          </div>
          {step.imageUrl && (
            <div className="aspect-[4/3] flex-shrink-0 object-cover rounded-lg overflow-hidden relative w-52">
              <Image
                alt="Step image"
                src={step.imageUrl}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepsFeed;
