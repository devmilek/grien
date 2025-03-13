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
import AvatarUploader from "../avatar-uploader";
import { AtSignIcon } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";

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

  const maxLength = 500;
  const {
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength });

  return (
    <div className="overflow-hidden p-6">
      <AvatarUploader src={user.image} />
      <Form {...form}>
        <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa profilu *</FormLabel>
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
                <FormLabel>Nazwa użytkownika *</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      className="peer ps-9"
                    />
                  </FormControl>
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <AtSignIcon size={16} aria-hidden="true" />
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <FormLabel>Bio</FormLabel>
                  <span className="text-xs text-muted-foreground">
                    {characterCount}/{limit}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isLoading}
                    maxLength={maxLength}
                    onChange={(e) => {
                      handleChange(e);
                      field.onChange(e);
                    }}
                  />
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
    </div>
  );
};

export default EditProfileForm;
