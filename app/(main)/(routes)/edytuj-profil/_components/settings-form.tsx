"use client";

import { updateUserInfo } from "@/actions/update-user-info";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface SettingsFormProps {
  user: User;
}

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  bio: z.string(),
});

const SettingsForm = ({ user }: SettingsFormProps) => {
  const router = useRouter();
  const { update } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email || "",
      name: user.name || "",
      bio: user.bio || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.promise(
      async () => {
        await updateUserInfo(data);
        await update({
          name: data.name,
        });
        router.refresh();
      },
      {
        loading: "Zapisywanie zmian...",
        success: "Zapisano zmiany",
        error: "Nie udało się zapisać zmian",
      },
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres email</FormLabel>
                <FormControl>
                  <Input disabled={true} readOnly {...field} />
                </FormControl>
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
                  <Textarea disabled={isLoading} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingsForm;
