"use client";

import { Category } from "@/db/schema";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAttributes } from "@/hooks/use-attributes";
import NavItemsItem from "./nav-items-item";

const NavItems = ({
  className,
  categories,
}: {
  className?: string;
  categories: Category[];
}) => {
  const { data } = useAttributes();

  return (
    <>
      <NavigationMenu className={className}>
        <NavigationMenuList>
          <NavItemsItem
            title="Kategorie"
            items={categories}
            type="categories"
          />
          <NavItemsItem
            title="Kuchnie świata"
            items={data?.cuisines}
            type="cuisines"
          />
          <NavItemsItem
            title="Okazje"
            items={data?.occasions}
            type="occasions"
          />
          <NavItemsItem title="Diety" items={data?.diets} type="diets" />
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
export default NavItems;
