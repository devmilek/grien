"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { RecipeStepSchema, recipeStepSchema } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Dropzone from "@/components/global/dropzone";
import { Textarea } from "@/components/ui/textarea";
import { PreparationStepWithId, useRecipeStore } from "../../use-recipe-store";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";

const StepForm = ({
  data,
  onSubmit,
}: {
  data?: PreparationStepWithId;
  onSubmit?: () => void;
}) => {
  const { addPreparationStep, updatePreparationStep } = useRecipeStore();
  const form = useForm<RecipeStepSchema>({
    resolver: zodResolver(recipeStepSchema),
    defaultValues: {
      description: data?.description || "",
      imageId: data?.imageId,
    },
  });

  const handleSubmit = (values: RecipeStepSchema) => {
    if (data) {
      updatePreparationStep({
        ...values,
        id: data.id,
      });
    } else {
      addPreparationStep({
        ...values,
        id: v4(),
      });
    }
    onSubmit?.();
    form.reset();
  };

  return (
    <div className="rounded-xl p-6 bg-white">
      <Form {...form}>
        <form className="flex gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            name="imageId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zdjęcie</FormLabel>
                <FormControl>
                  <Dropzone className="aspect-square max-w-52" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1">
                <FormLabel className="h-min">Treść</FormLabel>
                <FormControl className="h-full">
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex justify-end mt-4">
        <Button onClick={form.handleSubmit(handleSubmit)}>
          {data ? "Zapisz zmiany" : "Dodaj krok"}
        </Button>
      </div>
    </div>
  );
};

export default StepForm;
