import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageLicenceBadge from "../global/image-licence-badge";
import { RecipeForCard } from "@/actions/get-recipes-for-cards";
import { getInitials } from "@/utils";

const HorizontalCard = ({
  slug,
  image,
  category,
  name,
  description,
  user,
  className,
}: RecipeForCard & {
  className?: string;
}) => {
  return (
    <div
      key={slug}
      className={cn(
        "group flex items-center gap-6 flex-col sm:flex-row",
        className
      )}
    >
      <div className="aspect-[4/3] w-full sm:w-auto sm:h-40 md:h-52 shrink-0 relative rounded-lg overflow-hidden">
        <Image
          src={image.url}
          alt={"Zdjęcie przepisu " + name}
          fill
          className="group-hover:scale-105 transition-transform transform object-cover"
        />
        {image.licence && (
          <ImageLicenceBadge
            licence={image.licence}
            className="absolute z-40 top-2 right-2"
          />
        )}
      </div>
      <div>
        <Link
          className="flex items-center space-x-2 text-emerald-700 font-semibold text-xs mb-1"
          href={"/kategorie/" + slug}
        >
          {category.name}
        </Link>
        <Link
          href={"/przepisy/" + slug}
          className="text-2xl font-display link-underline link-underline-black"
        >
          {name}
        </Link>
        <p className="line-clamp-2 text-muted-foreground text-sm mt-1">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-4">
          <Avatar className="size-7">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{user.name}</p>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
