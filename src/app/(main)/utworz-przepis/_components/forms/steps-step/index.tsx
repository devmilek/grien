"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
import StepForm from "./step-form";
import StepsList from "./steps-list";
import { useRecipe } from "../../../context";

const StepsStep = () => {
  const { nextStep, previousStep } = useRecipe();
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="font-display text-3xl mb-8">Kroki przygotowania</h2>
      <StepForm />
      <StepsList />
      <div className="w-full justify-between flex items-center mt-12">
        <Button variant="outline" size="icon" onClick={previousStep}>
          <ChevronLeft />
        </Button>
        <Button variant="default" onClick={nextStep}>
          Dalej
        </Button>
      </div>
    </div>
  );
};

export default StepsStep;
