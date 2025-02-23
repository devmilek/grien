import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

const HorizontalCard = ({
  id,
  slug,
  name,
  category,
  author,
  src,
  description,
  className,
}: {
  id: string;
  slug: string;
  name: string;
  category: string;
  author: string;
  src: string;
  description: string;
  className?: string;
}) => {
  return (
    <div
      key={id}
      className={cn(
        "group flex items-center gap-8 flex-col sm:flex-row",
        className
      )}
    >
      <div className="aspect-[4/3] w-full sm:w-auto sm:h-40 shrink-0 relative rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={"Zdjęcie przepisu " + name}
          objectFit="cover"
          fill
          className="group-hover:scale-105 transition-transform transform"
        />
      </div>
      <div>
        <Link
          className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm mb-1"
          href={"/" + category}
        >
          {category}
        </Link>
        <Link
          href={"/" + slug}
          className="text-xl font-display link-underline link-underline-black"
        >
          {name}
        </Link>
        <p className="line-clamp-2 text-muted-foreground text-sm mt-1">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="size-7">
            <AvatarFallback>{author[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{author}</p>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
