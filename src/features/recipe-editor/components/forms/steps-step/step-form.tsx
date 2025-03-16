"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Dropzone from "@/components/global/dropzone";
import { Textarea } from "@/components/ui/textarea";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useRecipe } from "@/features/recipe-editor/context/use-recipe-context";
import {
  recipeStepFormSchema,
  RecipeStepFormSchema,
} from "@/features/recipe-editor/schema/recipe-step-schema";

const StepForm = ({
  id,
  onSubmit,
  onCancel,
}: {
  id?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}) => {
  const { recipe, addStep, updateStep } = useRecipe();
  const isEditing = Boolean(id);
  const formRef = useRef<HTMLDivElement>(null);

  const step = id ? recipe.steps.find((step) => step.id === id) : undefined;

  const form = useForm<RecipeStepFormSchema>({
    resolver: zodResolver(recipeStepFormSchema),
    defaultValues: {
      description: step?.description || "",
      imageId: step?.imageId,
    },
  });

  useEffect(() => {
    if (isEditing && onCancel) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          formRef.current &&
          !formRef.current.contains(event.target as Node)
        ) {
          onCancel();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isEditing, onCancel]);

  const handleSubmit = (values: RecipeStepFormSchema) => {
    if (isEditing && id) {
      updateStep(id, {
        ...values,
      });
    } else {
      addStep({
        ...values,
        id: v4(),
      });
    }
    onSubmit?.();
    form.reset();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="rounded-xl p-6 bg-white" ref={formRef}>
      <Form {...form}>
        <form
          className="flex gap-4 flex-col md:flex-row"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            name="imageId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zdjęcie</FormLabel>
                <FormControl>
                  <Dropzone
                    onChange={field.onChange}
                    value={field.value}
                    className="md:aspect-square md:max-w-52"
                  />
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
      <div className="flex justify-end mt-4 gap-4">
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Anuluj
          </Button>
        )}
        <Button onClick={form.handleSubmit(handleSubmit)}>
          {isEditing ? "Zapisz zmiany" : "Dodaj krok"}
        </Button>
      </div>
    </div>
  );
};

export default StepForm;
