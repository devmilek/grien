"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIngredients } from "@/hooks/use-ingredients";
import { IngredientSchema } from "@/schemas/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const IngredientForm = ({ recipeId }: { recipeId: string }) => {
  const { mutateAddIngredient } = useIngredients(recipeId);

  const form = useForm<z.infer<typeof IngredientSchema>>({
    resolver: zodResolver(IngredientSchema),
    defaultValues: {
      quantity: 0,
      unit: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof IngredientSchema>) => {
    mutateAddIngredient(values);
    console.log(values);
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-end space-y-4"
      >
        <div className="grid grid-cols-2 w-full gap-2 sm:gap-4 md:grid-cols-5">
          <FormField
            name="quantity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ilość</FormLabel>
                <FormControl>
                  <Input
                    className=""
                    placeholder="0"
                    {...field}
                    type="number"
                  />
                </FormControl>
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
                  <Input className="" {...field} placeholder="np. Gram" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="np. Mąka"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="ml-auto">
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Dodaj do listy
        </Button>
      </form>
    </Form>
  );
};

export default IngredientForm;
