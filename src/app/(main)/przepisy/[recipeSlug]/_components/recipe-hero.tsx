import ImageLicenceBadge from "@/components/global/image-licence-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Category, Image as DbImage, Licence, Recipe, User } from "@/db/schema";
import { formatDifficulty, formatTime } from "@/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ChartNoAxesColumnDecreasing, ClockIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface RecipeHeroProps {
  recipe: Recipe & {
    image:
      | (DbImage & {
          licence: Licence;
        })
      | null;
    licence: Licence | null;
    user: User;
    category: Category;
  };
}

const RecipeHero = ({ recipe }: RecipeHeroProps) => {
  return (
    <TooltipProvider>
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
          {recipe.image?.licence && (
            <ImageLicenceBadge
              licence={recipe.image.licence}
              className="absolute z-40 right-4 bottom-4 "
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex-1">
            <h1 className="text-3xl font-display">{recipe.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className=" size-7">
                <AvatarFallback>
                  {recipe.licence
                    ? recipe.licence.author.charAt(0) || "A"
                    : recipe.user.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-emerald-700 font-medium text-sm">
                {recipe.licence ? recipe.licence.author : recipe.user.name}
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
              <Badge variant="outline">{recipe.category.name}</Badge>
              <Badge variant="outline">
                <ClockIcon className="size-3 mr-1" />
                {formatTime(recipe.preparationTime)}
              </Badge>
              <Badge variant="outline">
                <ChartNoAxesColumnDecreasing className="size-3 mr-1" />
                {formatDifficulty(recipe.difficulty)}
              </Badge>
              {cuisines.length > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline">
                      {cuisines.length > 1
                        ? `${cuisines.length} kuchnie`
                        : cuisines[0].attribute.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {cuisines.map((cuisine) => (
                      <span key={cuisine.attribute.id}>
                        {cuisine.attribute.id},{" "}
                      </span>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
              {diets.length > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline">
                      {diets.length > 1
                        ? `${diets.length} diety`
                        : diets[0].attribute.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {diets.map((diet) => (
                      <span key={diet.attribute.id}>
                        {diet.attribute.name},{" "}
                      </span>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}

              {occasions.length > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline">
                      {occasions.length > 1
                        ? `${occasions.length} okazje`
                        : occasions[0].attribute.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {occasions.map((occasion) => (
                      <span key={occasion.attribute.id}>
                        {occasion.attribute.name},{" "}
                      </span>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
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
                  <Link href={`/utworz-przepis/${recipe.slug}`}>Edytuj</Link>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost">
                      <HeartIcon />
                      {likes}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Polub przepis</TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="space-x-2 flex">
              {user && <AddRecipeToCollectionModal recipeId={recipe.id} />}

              <Button variant="ghost">
                <ShareIcon />
                Udostępnij
              </Button>
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default RecipeHero;
