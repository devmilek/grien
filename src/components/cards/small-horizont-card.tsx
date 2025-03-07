import Link from "next/link";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { pl } from "date-fns/locale";
import { RecipeForCard } from "@/actions/get-recipes-for-cards";

const SmallHorizontCard = ({
  slug,
  imageSrc,
  // category,
  name,
  user,
  className,
  createdAt,
}: RecipeForCard & {
  className?: string;
}) => {
  return (
    <div key={slug} className={cn("group flex items-center gap-4", className)}>
      <div className="aspect-square w-20 shrink-0 relative rounded-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={"Zdjęcie przepisu " + name}
          fill
          className="group-hover:scale-105 transition-transform transform object-cover"
        />
      </div>
      <div className="w-full">
        <Link
          href={"/przepisy/" + slug}
          className="font-display line-clamp-2 text-lg"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNowStrict(createdAt, {
              addSuffix: true,
              locale: pl,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmallHorizontCard;
