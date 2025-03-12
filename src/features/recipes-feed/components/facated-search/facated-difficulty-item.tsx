import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { difficulties, Difficulty } from "@/db/schema";
import { formatDifficulty } from "@/utils";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import React from "react";

const FacatedDifficultyItem = () => {
  const [difficulty, setDifficulty] = useQueryState(
    "trudnosc",
    parseAsStringLiteral(["none", ...difficulties])
      .withOptions({
        clearOnDefault: true,
      })
      .withDefault("none")
  );
  return (
    <AccordionItem value="difficulty">
      <AccordionTrigger className="font-semibold">
        Poziom trudności
        {difficulty !== "none" && ` (${formatDifficulty(difficulty)})`}
      </AccordionTrigger>
      <AccordionContent>
        <RadioGroup
          value={difficulty ?? ""}
          onValueChange={(value: string) => setDifficulty(value as Difficulty)}
        >
          <div className="flex gap-2">
            <RadioGroupItem id="none" value="none" />
            <label htmlFor={"none"} className="leading-none text-sm">
              Wszystkie
            </label>
          </div>
          {difficulties.map((item) => (
            <div key={item} className="flex gap-2">
              <RadioGroupItem id={item} value={item} />
              <label htmlFor={item} className="leading-none text-sm">
                {formatDifficulty(item)}
              </label>
            </div>
          ))}
        </RadioGroup>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FacatedDifficultyItem;
