import db from "@/db";
import { images, recipes, users } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = async () => {
  const data = await db
    .select({
      ...getTableColumns(recipes),
      image: images.url,
      user: users.name,
    })
    .from(recipes)
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .limit(3);

  return (
    <div className="grid grid-cols-3 gap-6">
      {data.map((recipe) => (
        <Link
          href={"/" + recipe.slug}
          key={recipe.id}
          className="h-96 relative block rounded-xl overflow-hidden group"
        >
          <div className="size-full bg-gradient-to-t from-black/80 to-black/0 absolute z-10 p-6 flex flex-col justify-end">
            <h2 className="font-display text-3xl text-white">{recipe.name}</h2>
          </div>
          <Image
            src={recipe.image}
            alt={recipe.name}
            width={400}
            height={400}
            objectFit="cover"
            className="z-0 size-full object-cover group-hover:scale-105 transition-transform transform"
          />
        </Link>
      ))}
    </div>
  );
};

export default HeroSection;
