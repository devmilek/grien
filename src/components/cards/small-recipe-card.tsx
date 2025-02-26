import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageLicenceBadge from "../global/image-licence-badge";
import { RecipeForCard } from "@/actions/get-recipes-for-cards";
import { getInitials } from "@/utils";

const SmallRecipeCard = ({
  slug,
  image,
  category,
  name,
  user,
  className,
}: RecipeForCard & {
  className?: string;
}) => {
  return (
    <div
      key={slug}
      className={cn("group flex flex-col items-center gap-4", className)}
    >
      <div className="aspect-[4/3] w-full shrink-0 relative rounded-lg overflow-hidden">
        <Image
          src={image.url}
          alt={"Zdjęcie przepisu " + name}
          objectFit="cover"
          fill
          className="group-hover:scale-105 transition-transform transform"
        />
        {image.licence && (
          <ImageLicenceBadge
            licence={image.licence}
            className="absolute z-40 top-3 right-3"
          />
        )}
      </div>
      <div className="w-full">
        <Link
          className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm mb-1"
          href={"/kategorie/" + category.slug}
        >
          {category.name}
        </Link>
        <Link
          href={"/przepisy/" + slug}
          className="text-xl font-display link-underline link-underline-black line-clamp-2"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2 mt-2">
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

export default SmallRecipeCard;
