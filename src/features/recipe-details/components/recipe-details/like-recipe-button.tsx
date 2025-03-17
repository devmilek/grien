import { Button } from "@/components/ui/button";
import { honoClient } from "@/lib/hono-client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const LikeRecipeButton = ({ recipeId }: { recipeId: string }) => {
  const { data, refetch } = useQuery({
    queryKey: ["likes", recipeId],
    queryFn: async () => {
      const res = await honoClient.api.likes[":id"].$get({
        param: {
          id: recipeId,
        },
      });

      if (!res.ok) {
        throw new Error("Wystąpił błąd");
      }

      return await res.json();
    },
  });

  const handleClick = async () => {
    const res = await honoClient.api.likes[":id"].$post({
      param: {
        id: recipeId,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message);
    }

    refetch();
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      <HeartIcon
        className={cn({
          "text-red-500 fill-red-500": data?.hasLiked,
        })}
      />
      {data?.likes || 0}
    </Button>
  );
};

export default LikeRecipeButton;
