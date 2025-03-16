"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { createComment } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { commentSchema, CommentSchema } from "./schema";
import { queryClient } from "@/components/providers/query-provider";

const CommentForm = ({ recipeId }: { recipeId: string }) => {
  const form = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: CommentSchema) => {
    const { status, message } = await createComment(recipeId, data.content);

    if (status === 201) {
      form.reset();
      toast.success("Komentarz został dodany");
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    } else {
      toast.error(message);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form
          className="flex-1 relative"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 relative">
                <FormControl>
                  <Input
                    placeholder="Napisz swój komentarz..."
                    className="rounded-full w-full"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <Button
                  size="icon"
                  variant="secondary"
                  className={cn(
                    "rounded-full absolute right-1.5 top-1.5 size-6 transition-opacity",
                    {
                      "opacity-0": !field.value,
                    }
                  )}
                >
                  <SendIcon />
                </Button>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
