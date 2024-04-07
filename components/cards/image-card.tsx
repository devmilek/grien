import { Recipe } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface ImageCardProps {
  recipe: Recipe & {
    category: {
      id: string;
      name: string;
    } | null;
    user: {
      id: string;
      name: string;
    } | null;
  };
  className?: string;
}

const ImageCard = ({ recipe, className }: ImageCardProps) => {
  return (
    <div
      className={cn(
        "group bg-gradient-to-t text-white from-black/60 to-black/0 relative w-full h-80 sm:h-96 rounded-xl overflow-hidden flex flex-col justify-end p-6",
        className,
      )}
    >
      <div>
        <Link
          href={"/kategorie/" + recipe.categoryId}
          className="mt-4 cursor-pointer uppercase font-medium text-xs"
        >
          {recipe.category?.name}
        </Link>
        <Link
          href={"/przepis/" + recipe.id}
          className="text-3xl font-display mt-1 block"
        >
          <span className="underline-anim group-hover:bg-[length:100%_2px]">
            {recipe.name}
          </span>
        </Link>
        <div className="text-xs mt-2 opacity-70">
          <Link href={"/"} className="capitalize">
            {recipe.user?.name}
          </Link>
          {" • "}
          {moment(recipe.createdAt).fromNow()}
        </div>
      </div>
      {recipe.image && (
        <Image
          src={recipe.image}
          alt={recipe.name}
          width={300}
          height={200}
          className="w-full h-full object-cover absolute inset-0 -z-10 group-hover:scale-105 transition"
        />
      )}
    </div>
  );
};

const ImageCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-96 rounded-xl flex justify-end bg-white p-8 flex-col",
        className,
      )}
    >
      <Skeleton className="h-full w-full mb-3" />
      <Skeleton className="w-1/3 h-4 mb-1" />
      <Skeleton className="w-2/3 h-7" />
    </div>
  );
};

export { ImageCard, ImageCardSkeleton };
