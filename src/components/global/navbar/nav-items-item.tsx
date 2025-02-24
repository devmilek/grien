import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Attribute, Category } from "@/db/schema";
import Link from "next/link";
import React from "react";

const NavItemsItem = ({
  title,
  items,
}: {
  title: string;
  items?: Attribute[] | Category[];
  isLoading?: boolean;
}) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent className="p-6 w-max">
        <h2 className="font-display text-2xl text-emerald-700">{title}</h2>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-2 mt-4 w-xs">
          {items?.map((item) => (
            <li key={item.id}>
              <Link
                href={`/kategoria/${item.name}`}
                className="text-sm hover:underline"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NavItemsItem;
