"use client";

import React from "react";
import { RecipeCreationStep, useRecipe } from "../context";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  desc: string;
  step: RecipeCreationStep;
}

const steps: Step[] = [
  {
    title: "Podstawy",
    desc: "Podstawowe informacje",
    step: "basics",
  },
  {
    title: "Składniki",
    desc: "Lista składników",
    step: "ingredients",
  },
  {
    title: "Kroki przygotowania",
    desc: "Instrukcje krok po kroku",
    step: "steps",
  },
  {
    title: "Podsumowanie",
    desc: "Dodatkowe informacje",
    step: "additional",
  },
];

const RecipeStepper = () => {
  const { currentStep, setCurrentStep } = useRecipe();

  const currentStepIndex = steps.findIndex((step) => step.step === currentStep);

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(steps[stepIndex - 1].step);
  };

  return (
    <div className="container mt-6 mb-10">
      <Stepper
        value={currentStepIndex + 1}
        onValueChange={(val) => {
          if (currentStep === "basics") {
            toast.info(
              "Użyj przycisku 'Dalej' aby przejść do kolejnego kroku."
            );
            return;
          }
          handleStepChange(val);
        }}
      >
        {steps.map(({ step, title, desc }, index) => (
          <StepperItem
            key={step}
            step={index + 1}
            className={cn("not-last:flex-1 max-md:items-start", {})}
          >
            <StepperTrigger className="rounded max-md:flex-col cursor-pointer">
              <StepperIndicator />
              <div className="text-center md:text-left">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="max-sm:hidden">
                  {desc}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {index < steps.length && (
              <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
            )}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
};

export default RecipeStepper;
