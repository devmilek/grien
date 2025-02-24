import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SmallRecipeCard = ({
  id,
  slug,
  name,
  category,
  categorySlug,
  author,
  src,
  className,
}: {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  author: string;
  src: string;
  className?: string;
}) => {
  return (
    <div
      key={id}
      className={cn("group flex flex-col items-center gap-4", className)}
    >
      <div className="aspect-[4/3] w-full shrink-0 relative rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={"Zdjęcie przepisu " + name}
          objectFit="cover"
          fill
          className="group-hover:scale-105 transition-transform transform"
        />
      </div>
      <div className="w-full">
        <Link
          className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm mb-1"
          href={"/" + categorySlug}
        >
          {category}
        </Link>
        <Link
          href={"/" + categorySlug + "/" + slug}
          className="text-xl font-display link-underline link-underline-black line-clamp-2"
        >
          {name}
        </Link>
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

export default SmallRecipeCard;
