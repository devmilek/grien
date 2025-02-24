import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import db from "@/db";
import { recipes } from "@/db/schema";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { pl } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  ChartNoAxesColumnDecreasing,
  ClockIcon,
  HeartIcon,
  ShareIcon,
} from "lucide-react";
import { formatDifficulty, formatTime } from "@/utils";
import { Button } from "@/components/ui/button";
import IngredientsList from "./_components/ingredients-list";
import StepsList from "./_components/steps-list";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CookingModeModal from "./_components/cooking-mode-modal";
import CommentsCard from "./_components/comments-card";
import { getCurrentSession } from "@/lib/auth/utils";
import Link from "next/link";

const RecipePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { user } = await getCurrentSession();
  const slug = (await params).slug;
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.slug, slug),
    with: {
      image: true,
      user: true,
      ingredients: true,
      steps: {
        with: {
          image: true,
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  return (
    <div className="mx-auto container">
      {/* hero */}
      <section className="grid gap-4 lg:grid-cols-2 lg:gap-8 md:min-h-96 bg-white rounded-xl p-4 md:p-6">
        <div className="w-full relative aspect-[4/3] rounded-lg overflow-hidden">
          {recipe.image && (
            <Image
              fill
              alt=""
              src={recipe.image?.url}
              className="objec"
              objectFit="cover"
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex-1">
            <h1 className="text-3xl font-display">{recipe.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className=" size-7">
                <AvatarFallback>{recipe.user.name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-emerald-700 font-medium text-sm">
                {recipe.user.name}
              </p>
              <p className="text-gray-400">&#8226;</p>
              <p className="text-muted-foreground text-sm">
                {/* unicode dot */}
                {format(recipe.createdAt, "PPP", {
                  locale: pl,
                })}
              </p>
            </div>
            {/* ATTRIBUTES */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline">
                <ClockIcon className="size-3 mr-1" />
                {formatTime(recipe.preparationTime)}
              </Badge>
              <Badge variant="outline">
                <ChartNoAxesColumnDecreasing className="size-3 mr-1" />
                {formatDifficulty(recipe.difficulty)}
              </Badge>
            </div>
            {/* DESC */}
            <p className="text-muted-foreground text-sm mt-4">
              {recipe.description}
            </p>
          </div>
          <div className="border-t pt-2 flex gap-2 justify-between flex-col sm:flex-row mt-4">
            <div className="space-x-2 flex">
              <CookingModeModal steps={recipe.steps} />
              {user && user.id === recipe.userId ? (
                <Button variant="outline" asChild>
                  <Link href={`/recipe/create/${recipe.slug}`}>Edytuj</Link>
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost">
                        <HeartIcon />
                        3.4k
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Polub przepis</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="space-x-2 flex">
              <Button variant="ghost">
                <Bookmark />
                <span className="lg:hidden xl:inline-block">Zapisz</span>
              </Button>

              <Button variant="ghost">
                <ShareIcon />
                Udostępnij
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* LAYOUT */}
      <div className="flex gap-6 mt-6 flex-col lg:flex-row">
        <div className="lg:w-[380px]">
          <IngredientsList
            ingredients={recipe.ingredients}
            portions={recipe.portions}
          />
        </div>
        <div className="flex-1 space-y-8">
          <StepsList steps={recipe.steps} />
          <CommentsCard recipeId={recipe.id} />
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
