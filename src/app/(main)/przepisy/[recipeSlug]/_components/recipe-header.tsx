import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import React from "react";

const RecipeHeader = ({
  name,
  createdAt,
  author,
}: {
  name: string;
  createdAt: Date;
  author: {
    name: string;
    username: string | null;
  };
}) => {
  return (
    <header>
      <h1 className="text-3xl font-display">{name}</h1>
      <div className="flex items-center gap-2 mt-2">
        <Link
          href={`/kucharze/${author.username}`}
          className="flex items-center gap-2"
        >
          <Avatar className=" size-7">
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
          <span className="text-emerald-700 font-medium text-sm">
            {author.name}
          </span>
        </Link>
        <p className="text-gray-400">&#8226;</p>
        <p className="text-muted-foreground text-sm">
          {format(createdAt, "PPP", {
            locale: pl,
          })}
        </p>
      </div>
    </header>
  );
};

export default RecipeHeader;
