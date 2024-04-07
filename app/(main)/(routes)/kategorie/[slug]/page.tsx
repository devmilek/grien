import { db } from "@/lib/db";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Sidebar from "../../../../../components/navigation/sidebar/sidebar";
import { DrumstickIcon } from "lucide-react";
import RecipesFeed from "./_components/recipes-feed";
import Pagination from "@/components/pagination";
import { PAGINATION_ITEMS_PER_PAGE } from "@/constants";
import SortButton from "@/components/sort-button";
import RecipesHero from "@/components/recipes-hero";
import SectionWrapper from "@/components/section-wrapper";
import { HorizontalCardSkeletonFeed } from "@/components/cards/horizontal-card";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const category = await db.category.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!category) {
    return null;
  }

  return {
    title: category.name,
    description: `Przepisy z kategorii ${category.name}`,
    image: category.image,
    type: "article",
  };
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    orderBy?: "asc" | "desc";
    page?: string;
  };
}

const Page = async ({ params, searchParams }: CategoryPageProps) => {
  const orderBy = searchParams?.orderBy || "desc";
  const currentPage = Number(searchParams?.page) || 1;

  const category = await db.category.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      _count: {
        select: { recipes: true },
      },
    },
  });

  if (!category) {
    return notFound();
  }

  const totalPages = Math.ceil(
    category._count.recipes / PAGINATION_ITEMS_PER_PAGE,
  );

  return (
    <div className="">
      <RecipesHero
        headline="Przepisy z kategorią"
        heading={category.name}
        imageSrc={category.image}
      />
      <div className="flex gap-4 mt-6 flex-col lg:flex-row">
        <SectionWrapper className="flex-1 h-fit">
          <header className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl lg:text-4xl">Wyniki</h1>
            <SortButton />
          </header>
          {category._count.recipes > 0 ? (
            <>
              <Suspense fallback={<HorizontalCardSkeletonFeed count={5} />}>
                <RecipesFeed
                  categoryId={category.id}
                  orderBy={orderBy}
                  currentPage={currentPage}
                />
              </Suspense>
              <Pagination totalPages={totalPages} />
            </>
          ) : (
            <div className="flex flex-col items-center mt-10">
              <DrumstickIcon className="text-emerald-600 h-10 w-10" />
              <h1 className="mt-4">
                Nikt jeszcze nie dodał przepisu z kategorią{" "}
                <strong>{category.name}</strong>
              </h1>
              <p className="text-muted-foreground text-sm">
                Może będziesz pierwszy?
              </p>
            </div>
          )}
        </SectionWrapper>
        <Sidebar />
      </div>
    </div>
  );
};

export default Page;
