"use client";

import { login } from "@/actions/auth/login";
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
import { signIn } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Socials from "../socials";
import { FormError } from "./form-error";
import { credentialSignIn, magicLinkSignIn } from "@/actions/server-sign-in";

const formSchema = z.object({
  email: z.string().email({
    message: "Niepoprawny adres email",
  }),
  // password: z.string(),
});

const SignInForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      // password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    startTransition(async () => {
      await credentialSignIn(values.email);
    });
  };

  return (
    <div>
      <Form {...form}>
        <form className="mt-8 mb-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div className="justify-end flex">
              <Link
                className="text-xs font-semibold text-emerald-600"
                href="/forgot-password"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
            <FormError message={error} />
          </div>
          <Button
            disabled={isPending}
            className="w-full mt-6"
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Zaloguj się
          </Button>
        </form>
      </Form>
      <Socials />
    </div>
  );
};

export default SignInForm;
