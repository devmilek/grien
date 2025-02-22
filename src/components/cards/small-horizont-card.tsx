import Link from "next/link";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { pl } from "date-fns/locale";

const SmallHorizontCard = ({
  id,
  slug,
  name,
  author,
  src,
  className,
  createdAt,
}: {
  id: string;
  slug: string;
  name: string;
  author: string;
  src: string;
  className?: string;
  createdAt: Date;
}) => {
  return (
    <div key={id} className={cn("group flex items-center gap-4", className)}>
      <div className="aspect-square w-20 shrink-0 relative rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={"Zdjęcie przepisu " + name}
          objectFit="cover"
          fill
          className="group-hover:scale-105 transition-transform transform"
        />
      </div>
      <div className="w-full">
        <Link href={"/" + slug} className="font-display line-clamp-2">
          {name}
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-xs font-medium">{author}</p>
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
