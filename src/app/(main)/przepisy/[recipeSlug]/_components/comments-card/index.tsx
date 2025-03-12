"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getRecipeComments } from "./actions";
import CommentForm from "./comment-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { authClient } from "@/lib/auth/auth-client";

const CommentsCard = ({ recipeId }: { recipeId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["comments", recipeId],
    queryFn: async () => await getRecipeComments(recipeId),
  });

  const { data: sessionData } = authClient.useSession();

  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="text-2xl font-display">Komentarze</h2>
      <div className="my-4">
        {isLoading && <p>Loading...</p>}
        {data?.length === 0 && (
          <div className="text-center p-6 border border-dashed rounded-lg">
            <p className="font-semibold text-sm">Brak komentarzy</p>
            <p className="text-sm text-muted-foreground">
              Bądź pierwszy i podziel się swoją opinią na temat tego przepisu
            </p>
          </div>
        )}
        <div className="space-y-7">
          {data?.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="size-10">
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{comment.user.name}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {comment.content}
                </p>
                <div className="flex gap-2 items-center mt-2">
                  <button className="font-medium text-sm cursor-pointer">
                    Odpowiedz
                  </button>
                  <p className="text-xs text-muted-foreground">
                    (
                    {formatDistance(new Date(), comment.createdAt, {
                      addSuffix: true,
                      locale: pl,
                    })}
                    )
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {sessionData?.user && <CommentForm recipeId={recipeId} />}
    </div>
  );
};

export default CommentsCard;
