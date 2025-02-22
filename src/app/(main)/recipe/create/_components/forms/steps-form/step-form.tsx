"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { RecipeStepSchema, recipeStepSchema } from "../schema";

const StepForm = () => {
  const form = useForm<RecipeStepSchema>({
    resolver: zodResolver(recipeStepSchema),
    defaultValues: {
      description: "",
    },
  });
  return <div>-</div>;
};

export default StepForm;
