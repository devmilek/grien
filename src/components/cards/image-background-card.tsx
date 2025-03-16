import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageLicenceBadge from "../global/image-licence-badge";
import { RecipeForCard } from "@/actions/get-recipes-for-cards";
import { getInitials } from "@/utils";

const ImageBackgroudCard = ({
  slug,
  imageSrc,
  category,
  name,
  user,
  className,
  licence,
}: RecipeForCard & {
  className?: string;
}) => {
  return (
    <div
      key={slug}
      className={cn(
        "h-96 relative block rounded-xl overflow-hidden group",
        className
      )}
    >
      <div className="size-full bg-gradient-to-t from-black/80 to-black/0 absolute z-10 p-6 flex flex-col justify-end pointer-events-none">
        <div className="mb-1">
          <Badge
            variant="outline"
            className="bg-white pointer-events-auto"
            asChild
          >
            <Link href={"/kategorie/" + category.slug}>{category.name}</Link>
          </Badge>
        </div>
        <Link
          href={"/przepisy/" + slug}
          className="font-display text-3xl text-white line-clamp-2"
        >
          {name}
        </Link>
        <Link
          href={"/kucharze/" + user.username}
          className="flex items-center gap-2 mt-2"
        >
          <Avatar className="size-7 pointer-events-auto">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-white text-sm font-medium">{user.name}</p>
        </Link>
        {licence && (
          <ImageLicenceBadge
            licence={licence}
            className="absolute z-40 top-3 right-3"
          />
        )}
      </div>
      <Link href={"/przepisy/" + slug}>
        <Image
          src={imageSrc}
          alt={"Zdjęcie przepisu " + name}
          width={400}
          height={400}
          className="z-0 size-full object-cover group-hover:scale-105 transition-transform transform"
        />
      </Link>
    </div>
  );
};

export default ImageBackgroudCard;
