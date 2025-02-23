"use client";

import React from "react";
import BasicsForm from "./forms/basics-form";
import { Step, useRecipeStore } from "./use-recipe-store";
import IngredientsForm from "./forms/ingredients-form";
import StepsForm from "./forms/steps-form";
import { Carrot, ListCheck, Notebook, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Podstawy",
    description: "Podstawowe informacje",
    icon: Notebook,
    step: "basics",
  },
  {
    title: "Składniki",
    description: "Lista składników",
    icon: Carrot,
    step: "ingredients",
  },
  {
    title: "Kroki",
    description: "Niezbędne kroki",
    icon: ListCheck,
    step: "steps",
  },
  {
    title: "Dodatkowe informacje",
    description: "Więcej informacji",
    icon: Sparkles,
    step: "additional",
  },
];

const Stepper = () => {
  const { currentStep, setCurrentStep } = useRecipeStore();
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-4 mb-10 w-full justify-between border p-4 rounded-xl bg-background items-center mx-auto">
        {steps.map((step, index) => (
          <>
            <div
              key={index}
              className="w-full cursor-pointer"
              onClick={() => setCurrentStep(step.step as Step)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-10 bg-primary/10 text-primary shrink-0 flex items-center justify-center rounded-full transition-colors",
                    {
                      "text-white bg-primary": currentStep === step.step,
                    }
                  )}
                >
                  <step.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-nowrap">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-nowrap">
                    {step.description}
                  </p>
                </div>
              </div>
              {/* <div className="h-1 rounded-full w-full bg-foreground/5 mt-3" /> */}
            </div>
            <div className="w-1 h-full shrink-0 bg-border self-stretch" />
          </>
        ))}
      </div>
      <div>{currentStep === "basics" && <BasicsForm />}</div>
      <div>{currentStep === "ingredients" && <IngredientsForm />}</div>
      <div>{currentStep === "steps" && <StepsForm />}</div>
    </div>
  );
};

export default Stepper;
