import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ImageBackgroudCard = ({
  id,
  slug,
  name,
  category,
  author,
  src,
  className,
}: {
  id: string;
  slug: string;
  name: string;
  category: string;
  author: string;
  src: string;
  className?: string;
}) => {
  return (
    <Link
      href={"/" + slug}
      key={id}
      className={cn(
        "h-96 relative block rounded-xl overflow-hidden group",
        className
      )}
    >
      <div className="size-full bg-gradient-to-t from-black/80 to-black/0 absolute z-10 p-6 flex flex-col justify-end">
        <h2 className="font-display text-3xl text-white line-clamp-2">
          {name}
        </h2>
        <div className="mt-1">
          <Badge variant="outline" className="bg-white">
            {category}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="size-7">
            <AvatarFallback>{author[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="text-white text-sm font-medium">{author}</p>
        </div>
      </div>
      <Image
        src={src}
        alt={"Zdjęcie przepisu " + name}
        width={400}
        height={400}
        objectFit="cover"
        className="z-0 size-full object-cover group-hover:scale-105 transition-transform transform"
      />
    </Link>
  );
};

export default ImageBackgroudCard;
