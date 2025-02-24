"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2Icon, PlusIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { createCollectionSchema, CreateCollectionSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { createCollection } from "./actions";
import { toast } from "sonner";
import { queryClient } from "@/components/providers/query-provider";

const CreateCollectionPopover = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: "",
      public: false,
    },
  });

  const onSubmit = async (values: CreateCollectionSchema) => {
    const { status, message } = await createCollection(values);

    if (status === 200) {
      toast.success("Kolekcja została utworzona");
      await queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
      form.reset();
      setIsOpen(false);
    } else {
      toast.error(message);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Popover modal={true} open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <PlusIcon />
          Utwórz kolekcję
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Switch {...field} disabled={isLoading} />
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
      </PopoverContent>
    </Popover>
  );
};

export default CreateCollectionPopover;
