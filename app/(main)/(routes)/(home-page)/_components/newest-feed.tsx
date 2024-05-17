import { db } from "@/lib/db";
import { Recipe } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HorizontalCard,
  HorizontalCardSkeleton,
} from "@/components/cards/horizontal-card";
import { getNewestRecipes } from "@/data";
import SectionWrapper from "@/components/section-wrapper";
import { ROUTES } from "@/config/routes";

const NewestFeed = async () => {
  // const recipes = await getNewestRecipes();
  return (
    <SectionWrapper className="my-10">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Najnowsze</h1>
        <Link
          href={ROUTES.search}
          className="text-sm text-neutral-500 flex items-center space-x-1"
        >
          <span className="hidden sm:inline-block">Zobacz wszystkie</span>
          <ChevronRight className="h-4 w-4 inline-block" />
        </Link>
      </header>
      <div className="space-y-8 mt-8">
        {/* {recipes.map((recipe) => (
          <HorizontalCard key={recipe.id} recipe={recipe} />
        ))} */}
      </div>
    </SectionWrapper>
  );
};

const NewestFeedSkeleton = () => {
  return (
    <section className="bg-white p-6 lg:p-9 rounded-xl my-10">
      <header className="mb-8">
        <Skeleton className="h-9 w-1/3"></Skeleton>
      </header>
      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <HorizontalCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};

export { NewestFeed, NewestFeedSkeleton };
