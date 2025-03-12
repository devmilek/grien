import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Attribute, Category, Difficulty, RecipeAttribute } from "@/db/schema";
import { formatDifficulty, formatTime } from "@/utils";
import {
  pluralizeCuisines,
  pluralizeDiets,
  pluralizeOccasions,
  pluralizePortions,
  pluralizeViews,
} from "@/utils/pluralize-words";
import {
  ChartNoAxesColumnDecreasing,
  ClockIcon,
  EyeIcon,
  SliceIcon,
  TagIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const RecipeAttributes = ({
  category,
  preparationTime,
  attributes,
  difficulty,
  portions,
  views,
}: {
  category: Category;
  preparationTime: number;
  difficulty: Difficulty;
  portions: number;
  attributes: (RecipeAttribute & {
    attribute: Attribute;
  })[];
  views: number;
}) => {
  const occasions = attributes.filter(
    (attr) => attr.attribute.type === "occasions"
  );

  const cuisines = attributes.filter(
    (attr) => attr.attribute.type === "cuisines"
  );

  const diets = attributes.filter((attr) => attr.attribute.type === "diets");

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Badge variant="outline">
        <Link href={`/kategorie/${category.slug}`}>
          <TagIcon />
          {category.name}
        </Link>
      </Badge>
      <Badge variant="outline">
        <ClockIcon className="size-3 mr-1" />
        {formatTime(preparationTime)}
      </Badge>
      <Badge variant="outline">
        <ChartNoAxesColumnDecreasing className="size-3 mr-1" />
        {formatDifficulty(difficulty)}
      </Badge>
      <Badge variant="outline">
        <SliceIcon className="size-3 mr-1" />
        {portions} {pluralizePortions(portions)}
      </Badge>
      {cuisines.length > 0 && (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline">
              {cuisines.length > 1
                ? `${cuisines.length} ${pluralizeCuisines(cuisines.length)}`
                : cuisines[0].attribute.name}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {cuisines.map((cuisine) => (
              <span key={cuisine.attribute.id}>{cuisine.attribute.id}, </span>
            ))}
          </TooltipContent>
        </Tooltip>
      )}
      {diets.length > 0 && (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline">
              {diets.length > 1
                ? `${diets.length} ${pluralizeDiets(diets.length)}`
                : diets[0].attribute.name}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {diets.map((diet) => (
              <span key={diet.attribute.id}>{diet.attribute.name}, </span>
            ))}
          </TooltipContent>
        </Tooltip>
      )}

      {occasions.length > 0 && (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline">
              {occasions.length > 1
                ? `${occasions.length} ${pluralizeOccasions(occasions.length)}`
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

      <Badge variant="outline">
        <EyeIcon />
        {views + 1} {pluralizeViews(views + 1)}
      </Badge>
    </div>
  );
};

export default RecipeAttributes;
