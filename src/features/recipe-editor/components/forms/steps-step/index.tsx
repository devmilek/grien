"use client";

import React from "react";
import StepForm from "./step-form";
import StepsList from "./steps-list";

const StepsStep = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="font-display text-3xl mb-8">Kroki przygotowania</h2>
      <StepForm />
      <StepsList />
    </div>
  );
};

export default StepsStep;
