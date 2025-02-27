"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Attribute } from "@/db/schema";
import { useCategories } from "@/hooks/use-categories";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAttributes } from "@/hooks/use-attributes";

const FacatedSearch = ({
  showCategories = true,
  showCuisines = true,
  showOccasions = true,
  showDiets = true,
}: {
  showCategories?: boolean;
  showCuisines?: boolean;
  showOccasions?: boolean;
  showDiets?: boolean;
}) => {
  const { data } = useAttributes();

  return (
    <div className="bg-white rounded-xl p-6 py-3">
      <Accordion type="multiple" defaultValue={["kategorie"]}>
        {showCategories && <AccordionFacatedCategoriesItem />}
        {showCuisines && (
          <AccordionFacatedItem
            title="Kuchnie świata"
            items={data?.cuisines}
            value="kuchnie"
          />
        )}
        {showOccasions && (
          <AccordionFacatedItem
            title="Okazje"
            items={data?.occasions}
            value="okazje"
          />
        )}
        {showDiets && (
          <AccordionFacatedItem
            title="Diety"
            items={data?.diets}
            value="diety"
          />
        )}
      </Accordion>
    </div>
  );
};

const AccordionFacatedCategoriesItem = () => {
  const { data: categories } = useCategories();
  const [selectedCat, setSelectedCat] = useQueryState(
    "kategoria",
    parseAsString.withDefault("")
  );

  return (
    <AccordionItem value={"kategorie"}>
      <AccordionTrigger className="font-semibold">Kategorie</AccordionTrigger>
      <AccordionContent className="space-y-3">
        <RadioGroup value={selectedCat} onValueChange={setSelectedCat}>
          {categories?.map((item) => (
            <div key={item.id} className="flex gap-2">
              <RadioGroupItem id={item.id} value={item.slug} />
              <label htmlFor={item.id} className="leading-none text-sm">
                {item.name}
              </label>
            </div>
          ))}
        </RadioGroup>
      </AccordionContent>
    </AccordionItem>
  );
};

const AccordionFacatedItem = ({
  title,
  items,
  value,
}: {
  title: string;
  items?: Attribute[];
  value: string;
}) => {
  const [selectedItems, setSelectedItems] = useQueryState(
    value,
    parseAsArrayOf(parseAsString, ",").withDefault([]).withOptions({
      shallow: true,
    })
  );

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="font-semibold">
        {title} {selectedItems.length > 0 && `(${selectedItems.length})`}
      </AccordionTrigger>
      <AccordionContent className="space-y-3">
        {items?.map((item) => (
          <div key={item.id} className="flex gap-2">
            <Checkbox
              id={item.id}
              checked={selectedItems.includes(item.slug)}
              onCheckedChange={(val) => {
                setSelectedItems((prev) => {
                  if (val) {
                    return [...prev, item.slug];
                  }
                  return prev.filter((slug) => slug !== item.slug);
                });
              }}
            />
            <label htmlFor={item.id} className="leading-none text-sm">
              {item.name}
            </label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FacatedSearch;
