"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { setPassword } from "@/lib/auth/actions";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/ui/password-input";

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    revokeOtherSessions: z.boolean().default(false),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>;

const ChangePasswordForm = ({ isPasswordSet }: { isPasswordSet: boolean }) => {
  const router = useRouter();
  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: isPasswordSet ? "" : undefined,
      newPassword: "",
      confirmNewPassword: "",
      revokeOtherSessions: false,
    },
  });

  const onSubmit = async (data: ChangePasswordFormSchema) => {
    if (isPasswordSet) {
      if (!data.currentPassword) return;

      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: data.revokeOtherSessions,
      });

      if (error) {
        toast.error(
          error.message
            ? getErrorMessage(error.code)
            : "Nie udało się zmienić hasła. Spróbuj ponownie."
        );
        return;
      }

      toast.success("Zmieniono hasło.");
      router.refresh();
    } else {
      const status = await setPassword(data.newPassword);

      if (status) {
        toast.success("Hasło zostało zmienione.");
        router.refresh();
      } else {
        toast.error("Nie udało się zmienić hasła. Spróbuj ponownie.");
      }
    }
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        className="p-6 grid gap-4 border rounded-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isPasswordSet ? (
          <FormField
            name="currentPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Obecne hasło</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div>
            <Label>Obecne hasło</Label>
            <Input
              disabled
              readOnly
              className="mt-2"
              value="Nie ustawiono jeszcze hasła."
            />
          </div>
        )}
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nowe hasło</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmNewPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potwierdź hasło</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="revokeOtherSessions"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormLabel>Wyloguj z innych urządzeń</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
