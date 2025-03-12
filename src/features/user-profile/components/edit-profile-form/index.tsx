"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  editProfileSchema,
  EditProfileSchema,
} from "../../schema/edit-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EditProfileForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      username: user.username || "",
      bio: user.bio || "",
    },
  });

  const onSubmit = async (values: EditProfileSchema) => {
    console.log(values);
    const { error } = await authClient.updateUser({
      bio: values.bio,
      name: values.name,
      username: user.username === values.username ? undefined : values.username,
    });

    if (error) {
      toast.error("Nie udało się zaktualizować profilu", {
        description: error.code
          ? getErrorMessage(error.code)
          : "Spróbuj ponownie",
      });
    }

    router.refresh();
    toast.success("Profil zaktualizowany pomyślnie");
  };

  const isLoading = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form className="p-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa profilu</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                Nazwa użytkownika jest unikalna i może być zmieniona raz na 30
                dni.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="bio"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !isDirty}>
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
