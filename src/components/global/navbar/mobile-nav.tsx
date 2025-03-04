"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Attribute, AttributesType, Category } from "@/db/schema";
import { useAttributes } from "@/hooks/use-attributes";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const MobileNav = () => {
  const { data } = useAttributes();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden ml-auto">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4" showClose={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Menu</DialogTitle>
          <DialogDescription>
            Znajdziesz tutaj wszystkie kategorie i funkcje serwisu
          </DialogDescription>
        </DialogHeader>
        <div>
          <Accordion type="single" collapsible>
            <MobileNavItem
              title="Kategorie"
              items={data?.categories}
              type="categories"
            />
            <MobileNavItem
              title="Kuchnie świata"
              items={data?.cuisines}
              type="cuisines"
            />
            <MobileNavItem
              title="Okazje"
              items={data?.occasions}
              type="occasions"
            />
            <MobileNavItem title="Diety" items={data?.diets} type="diets" />
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const MobileNavItem = ({
  title,
  items,
  type,
}: {
  title: string;
  items?: Attribute[] | Category[];
  type: AttributesType | "categories";
}) => {
  const getLink = () => {
    switch (type) {
      case "categories":
        return "/kategorie";

      case "cuisines":
        return "/kuchnie-swiata";

      case "occasions":
        return "/okazje";

      case "diets":
        return "/diety";
    }
  };

  return (
    <AccordionItem value={type}>
      <AccordionTrigger className="font-display text-2xl text-emerald-700">
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <ul className="space-y-2">
          {items?.map((item) => (
            <li key={item.id}>
              <Link href={`${getLink()}/${item.slug}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MobileNav;
