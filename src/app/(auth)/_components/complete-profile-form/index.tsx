"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { completeProfileSchema, CompleteProfileSchema } from "./schema";
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
import { Button } from "@/components/ui/button";
import { User } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";

const CompleteProfileForm = ({ user }: { user: User }) => {
  const form = useForm<CompleteProfileSchema>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      imageUrl: user.image,
      name: user.name,
      username: user.username || "",
      bio: user.bio || "",
    },
  });
  return (
    <Form {...form}>
      <form className="gap-4 grid">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa profilu *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Pozwala na łatwiejsze znalezienie twojego profilu.
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Kontynuuj</Button>
      </form>
    </Form>
  );
};

export default CompleteProfileForm;
