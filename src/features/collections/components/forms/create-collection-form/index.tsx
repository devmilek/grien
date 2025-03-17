"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { createCollectionSchema, CreateCollectionSchema } from "./schema";
import { toast } from "sonner";
import { queryClient } from "@/components/providers/query-provider";
import { honoClient } from "@/lib/hono-client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

const CreateCollectionForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const form = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: "",
      public: false,
    },
  });

  const handleSubmit = async (values: CreateCollectionSchema) => {
    const res = await honoClient.api.collections.$post({
      json: {
        name: values.name,
        isPublic: values.public,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      return toast.error(data.message);
    }

    const data = await res.json();

    toast.success(data.message);
    await queryClient.invalidateQueries({
      queryKey: ["collections"],
    });
    form.reset();
    onSubmit?.();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa kolekcji</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="public"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div>
                <FormLabel>Publiczna</FormLabel>
                <FormDescription className="text-xs">
                  Kolekcja będzie widoczna dla innych użytkowników
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button size="sm" variant="outline" disabled={isLoading}>
          {isLoading && <Loader2Icon className="animate-spin" />}
          Utwórz kolekcję
        </Button>
      </form>
    </Form>
  );
};

export default CreateCollectionForm;
