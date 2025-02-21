"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRecipeStore } from "../../use-recipe-store";
import { recipeIngredientSchema, RecipeIngredientSchema } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

const IngredientForm = ({
  id,
  onSubmit,
}: {
  id?: string;
  onSubmit?: () => void;
}) => {
  const { addIngredient, ingredients, updateIngredient } = useRecipeStore();

  const ingredient = ingredients.find((ing) => ing.id === id);

  const form = useForm<RecipeIngredientSchema>({
    resolver: zodResolver(recipeIngredientSchema),
    defaultValues: {
      name: ingredient?.name || "",
      amount: ingredient?.amount || 0,
      unit: ingredient?.unit || "",
    },
  });

  const handleSubmit = (data: RecipeIngredientSchema) => {
    if (id) {
      updateIngredient({
        id: id,
        ...data,
      });
    } else {
      addIngredient({
        id: uuidv4(),
        ...data,
      });
    }
    form.reset();
    onSubmit?.();
  };

  return (
    <div className="bg-white rounded-xl p-12 mt-6">
      <Form {...form}>
        <form
          className="flex w-full gap-4 items-start"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="np. Mąka" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ilość</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="unit"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jednostka</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="justify-end w-full mt-6 flex">
        <Button onClick={form.handleSubmit(handleSubmit)}>
          {id ? "Zapisz zmiany" : "Dodaj składnik"}
        </Button>
      </div>
    </div>
  );
};

export default IngredientForm;
