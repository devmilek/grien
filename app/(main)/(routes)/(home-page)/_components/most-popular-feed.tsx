import { ImageCard, ImageCardSkeleton } from "@/components/cards/image-card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { delay } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

// const getMostPopularRecipes = async () => {
//   //TODO: get most popular not main dishes
//   const recipes = await db.recipe.findMany({
//     where: {
//       published: true,
//       category: {
//         slug: "dania-glowne",
//       },
//     },
//     include: {
//       category: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//       user: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//     },
//     take: 3,
//   });
//   return recipes;
// };

const MostPopularFeed = async () => {
  const recipes = await db.query.recipe.findMany();

  console.log(recipes);

  return (
    <section className="grid md:grid-cols-2 gap-5">
      {/* {recipes.map((recipe, index) => (
        <ImageCard
          recipe={recipe}
          key={recipe.id}
          className={index == 2 ? "md:col-span-2" : ""}
        />
      ))} */}
    </section>
  );
};

const MostPopularFeedSkeleton = () => {
  return (
    <section>
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        <ImageCardSkeleton />
        <ImageCardSkeleton />
        <ImageCardSkeleton className="md:col-span-2" />
      </div>
    </section>
  );
};

export { MostPopularFeed, MostPopularFeedSkeleton };
