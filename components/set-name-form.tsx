import { updateUser } from "@/actions/update-user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
const FormSchema = z.object({ name: z.string().min(1) });
const SetNameForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await updateUser(data.name);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Twoje imie" autoComplete="off" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-8">
          <Button type="submit">Zapisz</Button>
        </div>
      </form>
    </Form>
  );
};

export default SetNameForm;
