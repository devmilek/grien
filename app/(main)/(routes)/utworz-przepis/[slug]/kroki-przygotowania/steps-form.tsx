"use client";

import { addStep } from "@/actions/recipe-creation/steps";
import Dropzone from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PreparationStepSchema } from "@/schemas/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { PreparationStep } from "@prisma/client";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const StepsForm = ({
  recipeId,
  latestPosition,
}: {
  recipeId: number;
  latestPosition: number;
}) => {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof PreparationStepSchema>>({
    resolver: zodResolver(PreparationStepSchema),
    defaultValues: {
      image: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PreparationStepSchema>) => {
    startTransition(async () => {
      await addStep(values, recipeId, latestPosition);
      form.reset();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 p-12 rounded-xl bg-white"
      >
        <div className="flex gap-8">
          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zdjęcie kroku</FormLabel>
                <FormControl className="flex items-center">
                  <Dropzone
                    onUpload={field.onChange}
                    disabled={isPending}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Treść kroku *</FormLabel>
                <FormControl>
                  <Textarea disabled={isPending} rows={7} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit">
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Dodaj do listy
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StepsForm;
