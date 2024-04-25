"use client";

import { createRecipe } from "@/actions/recipe-creation/create-recipe";
import Dropzone from "@/components/dropzone";
import { useUtilityData } from "@/components/providers/utility-data-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { difficultyMap } from "@/maps";
import { zodResolver } from "@hookform/resolvers/zod";
import { Difficulty } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { recipe as OrmRecipe } from "@/lib/db/schema";
import { editRecipeBasics } from "@/actions/recipe-creation/edit-recipe-basics";
import { toast } from "sonner";
import { BasicsInformationSchema } from "@/schemas/recipe";

const EditBasicForm = ({
  recipe,
}: {
  recipe?: typeof OrmRecipe.$inferSelect;
}) => {
  console.log(recipe);
  const router = useRouter();
  const { categories } = useUtilityData();

  const editMode = !!recipe;

  const form = useForm<z.infer<typeof BasicsInformationSchema>>({
    resolver: zodResolver(BasicsInformationSchema),
    defaultValues: recipe
      ? {
          name: recipe.name,
          image: recipe.imageUrl,
          description: recipe.description,
          categoryId: recipe.categoryId.toString(),
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          preparationTime: recipe.preparationTime,
        }
      : undefined,
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof BasicsInformationSchema>) => {
    if (editMode) {
      try {
        await editRecipeBasics(recipe.slug, values);
        toast.success("Pomyślnie zaktualizowano", {
          description:
            "Możesz teraz dodać składniki i kroki do swojego przepisu.",
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const { slug } = await createRecipe(values);
        router.push(`/a-new-recipe/${slug}/skladniki`);
        toast.success("Pomyślnie utworzono przepis", {
          description:
            "Możesz teraz dodać składniki i kroki przygotowania do swojego przepisu.",
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-12">
      <div className="flex items-center space-x-4 pb-10">
        <div className="w-full">
          <h1 className="font-display text-4xl mb-2 w-full">
            {editMode ? "Podstawy" : "Tworzenie przepisu"}
          </h1>
          {!editMode && (
            <p className="text-neutral-500 text-sm mb-6">
              Przesyłanie własnych przepisów jest łatwe! Dodaj swój przepis do
              ulubionych, udostępnij go znajomym, rodzinie lub społeczności{" "}
              <span className="font-medium">grief</span>.
            </p>
          )}
        </div>
        <Button
          className=""
          size="lg"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editMode ? "Zapisz" : "Utwórz i przejdź dalej"}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa przepisu</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    type="text"
                    autoComplete="false"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    disabled={isLoading}
                    {...field}
                    placeholder=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zdjęcie</FormLabel>
                <FormControl className="flex items-center">
                  <Dropzone
                    onUpload={field.onChange}
                    disabled={isLoading}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="pt-6 w-full grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz kategorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ilość porcji</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poziom trudności</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz poziom trudności" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(["easy", "medium", "hard"] as const).map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {difficultyMap[diff]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preparationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Czas przygotowania{" "}
                    <span className="text-xs font-normal text-neutral-500">
                      (w minutach)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      className="w-full"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditBasicForm;
