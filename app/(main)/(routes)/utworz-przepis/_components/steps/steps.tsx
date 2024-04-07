"use client";

import React from "react";
import StepsFeed from "./steps-feed";
import StepsForm from "./steps-form";
import { useSteps } from "@/hooks/use-steps";

interface StepsFormProps {
  recipeId: string;
}

const Steps = ({ recipeId }: StepsFormProps) => {
  const { steps, mutateAddStep, mutateStepReorder } = useSteps(recipeId);

  return (
    <>
      <div className="bg-white rounded-xl p-8 mb-8">
        <StepsForm addStepFn={mutateAddStep} />
      </div>
      <div className="space-y-2">
        {steps && steps.length > 0 && (
          <StepsFeed steps={steps} onReorder={mutateStepReorder} />
        )}
      </div>
    </>
  );
};

export default Steps;
