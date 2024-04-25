import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoryCardProps {
  category: Category & {
    _count: {
      recipes: number;
    };
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      href={`/kategorie/${category.slug}`}
      className={cn(
        "group relative w-full h-20 rounded-xl overflow-hidden block",
      )}
    >
      <div className="relative z-10 w-full h-full p-8 flex text-white justify-between items-center bg-black/60">
        <h1 className="text-lg font-medium mt-1">{category.name}</h1>
      </div>
      {category.image && (
        <Image
          src={category.image}
          alt={"Zdjęcie kategorii " + category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition"
        />
      )}
    </Link>
  );
};

export default CategoryCard;
