"use client";

import React, { useRef, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  recipeIngredientFormSchema,
  RecipeIngredientFormSchema,
  useRecipe,
} from "../../../context";
import { v4 } from "uuid";
import { cn } from "@/lib/utils";
import {
  Button as AriaButton,
  Group,
  Input as AriaInput,
  NumberField,
} from "react-aria-components";
import { MinusIcon, PlusIcon } from "lucide-react";

// const COMMON_UNITS = [
//   "g",
//   "kg",
//   "ml",
//   "l",
//   "szt.",
//   "łyżka",
//   "łyżeczka",
//   "szklanka",
//   "szczypta",
// ];

interface IngredientFormProps {
  id?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const IngredientForm = ({ id, onSubmit, onCancel }: IngredientFormProps) => {
  const { recipe, updateIngredient, addIngredient } = useRecipe();
  const isEditing = Boolean(id);
  const formRef = useRef<HTMLDivElement>(null);

  const ingredient = id
    ? recipe.ingredients.find((ing) => ing.id === id)
    : undefined;

  const form = useForm<RecipeIngredientFormSchema>({
    resolver: zodResolver(recipeIngredientFormSchema),
    defaultValues: {
      name: ingredient?.name || "",
      amount: ingredient?.amount || 1, // Nie ustawiaj domyślnie 0
      unit: ingredient?.unit || "",
    },
  });

  const {
    formState: { isSubmitting, isDirty },
  } = form;

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

  const handleSubmit = (data: RecipeIngredientFormSchema) => {
    console.log("data", data);
    if (isEditing && id) {
      updateIngredient(id, data);
    } else {
      console.log("data", data);
      addIngredient({
        ...data,
        id: v4(),
      });
    }

    if (!isEditing) {
      form.reset({
        name: "",
        amount: 1,
        unit: "",
      });
    }

    onSubmit?.();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div
      ref={formRef}
      className={cn(
        "bg-white rounded-xl",
        isEditing && "p-8",
        !isEditing && "p-12"
      )}
    >
      <Form {...form}>
        <form
          className="flex w-full gap-4 items-start"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* ...existing code... */}
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
                  <NumberField
                    minValue={1}
                    {...field}
                    aria-label="Ilość składnika"
                  >
                    <Group className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:ring-[3px]">
                      <AriaButton
                        slot="decrement"
                        className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <MinusIcon size={16} aria-hidden="true" />
                      </AriaButton>
                      <AriaInput className="bg-background text-foreground w-full grow px-3 py-2 text-center tabular-nums" />
                      <AriaButton
                        slot="increment"
                        className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <PlusIcon size={16} aria-hidden="true" />
                      </AriaButton>
                    </Group>
                  </NumberField>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="unit"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-[200px]">
                <FormLabel>Jednostka</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="np. gram" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex gap-2 justify-end mt-6">
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Anuluj
          </Button>
        )}
        <Button
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting || (!isDirty && isEditing)}
        >
          {isEditing ? "Zapisz zmiany" : "Dodaj składnik"}
        </Button>
      </div>
    </div>
  );
};

export default IngredientForm;
