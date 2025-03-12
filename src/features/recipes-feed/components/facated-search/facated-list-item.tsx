"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Attribute } from "@/db/schema";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

const FacatedListItem = ({
  title,
  items,
  value,
}: {
  title: string;
  items: Attribute[] | undefined;
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

export default FacatedListItem;
