import { Image as DbImage, RecipeStep } from "@/db/schema";
import Image from "next/image";
import React from "react";

const StepsList = ({
  steps,
}: {
  steps: (RecipeStep & {
    image: DbImage | null;
  })[];
}) => {
  return (
    <div className="p-6 rounded-xl bg-white">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="border-b last:border-b-0 flex py-4 gap-8 last:pb-0 items-center first:pt-0"
        >
          <div className="py-4 flex-1">
            <h4 className="font-display text-2xl">Krok {index + 1}</h4>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
              {step.content}
            </p>
          </div>
          {step.image && (
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden w-48">
              <Image src={step.image.url} alt="" fill objectFit="cover" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepsList;
