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
  image,
  category,
  name,
  user,
  className,
}: RecipeForCard & {
  className?: string;
}) => {
  return (
    <Link
      href={"/przepisy/" + slug}
      key={slug}
      className={cn(
        "h-96 relative block rounded-xl overflow-hidden group",
        className
      )}
    >
      <div className="size-full bg-gradient-to-t from-black/80 to-black/0 absolute z-10 p-6 flex flex-col justify-end">
        <div className="mb-1">
          <Badge variant="outline" className="bg-white">
            {category.name}
          </Badge>
        </div>
        <h2 className="font-display text-3xl text-white line-clamp-2">
          {name}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="size-7">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <p className="text-white text-sm font-medium">{user.name}</p>
        </div>
        {image.licence && (
          <ImageLicenceBadge
            licence={image.licence}
            className="absolute z-40 top-3 right-3"
          />
        )}
      </div>
      <Image
        src={image.url}
        alt={"Zdjęcie przepisu " + name}
        width={400}
        height={400}
        className="z-0 size-full object-cover group-hover:scale-105 transition-transform transform"
      />
    </Link>
  );
};

export default ImageBackgroudCard;
