"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useUtilityData } from "../providers/utility-data-provider";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

const MobileMenuAccordion = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const { categories, attributes } = useUtilityData();

  return (
    <ScrollArea className="h-full">
      <Accordion type="multiple" className="mt-4">
        <AccordionItemComponent
          value="categories"
          title="Kategorie"
          items={categories}
          hrefPrefix={ROUTES.categories + "/"}
          setOpen={setOpen}
        />
        {/* <AccordionItemComponent
          value="occasions"
          title="Okazje"
          items={occasions}
          hrefPrefix={ROUTES.search + "?occasions="}
          setOpen={setOpen}
        />
        <AccordionItemComponent
          value="cuisines"
          title="Kuchnie świata"
          items={cuisines}
          hrefPrefix={ROUTES.search + "?cuisines="}
          setOpen={setOpen}
        />
        <AccordionItemComponent
          value="diets"
          title="Diety"
          items={diets}
          hrefPrefix={ROUTES.search + "?diets="}
          setOpen={setOpen}
        /> */}
      </Accordion>
    </ScrollArea>
  );
};

const AccordionItemComponent = ({
  value,
  title,
  items,
  hrefPrefix,
  setOpen,
}: {
  value: string;
  title: string;
  items: Array<{ slug: string; name: string }>;
  hrefPrefix: string;
  setOpen: (open: boolean) => void;
}) => {
  const { push } = useRouter();

  const onClick = (slug: string) => {
    push(`${hrefPrefix}${slug}`);
    setOpen(false);
  };

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-base">{title}</AccordionTrigger>
      <AccordionContent className="space-y-4 pl-4 grid">
        {items.map((item) => (
          <ItemLink
            key={item.slug}
            label={item.name}
            onClick={() => onClick(item.slug)}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

const ItemLink = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="hover:translate-x-2 transition-transform text-start"
    >
      {label}
    </button>
  );
};

export default MobileMenuAccordion;
