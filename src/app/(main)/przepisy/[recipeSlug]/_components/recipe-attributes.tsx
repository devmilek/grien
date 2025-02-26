import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Attribute, Category, Difficulty, RecipeAttribute } from "@/db/schema";
import { formatDifficulty, formatTime } from "@/utils";
import {
  ChartNoAxesColumnDecreasing,
  ClockIcon,
  SliceIcon,
  TagIcon,
} from "lucide-react";
import React from "react";

const RecipeAttributes = ({
  category,
  preparationTime,
  attributes,
  difficulty,
  portions,
}: {
  category: Category;
  preparationTime: number;
  difficulty: Difficulty;
  portions: number;
  attributes: (RecipeAttribute & {
    attribute: Attribute;
  })[];
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
        <TagIcon />
        {category.name}
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
        {portions} porcji
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
                ? `${diets.length} diety`
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
  );
};

export default RecipeAttributes;
