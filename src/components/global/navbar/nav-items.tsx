"use client";

import { Category, Cuisine, Diet, Occasion } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Portal } from "@radix-ui/react-portal";
import Link from "next/link";

const NavItems = ({
  className,
  categories,
  occasions,
  cuisines,
  diets,
}: {
  className?: string;
  categories: Category[];
  occasions: Occasion[];
  cuisines: Cuisine[];
  diets: Diet[];
}) => {
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  return (
    <>
      <nav className={cn("h-full text-sm flex", className)}>
        <button
          className={cn(
            "border-b-2 border-transparent  h-16 px-4 flex items-center gap-2 transition-colors cursor-pointer",
            {
              "border-emerald-600 text-emerald-700 font-medium": categoriesOpen,
            }
          )}
          onClick={() => setCategoriesOpen(!categoriesOpen)}
        >
          Przepisy
          <ChevronDown
            className={cn("size-4", {
              "transform -rotate-180 transition-transform": categoriesOpen,
            })}
          />
        </button>
        <button className="h-16 px-4 cursor-pointer">Składniki</button>
        <button className="h-16 px-4 cursor-pointer">Książki kucharskie</button>
      </nav>
      <Portal>
        {categoriesOpen && (
          <div className="absolute top-16 bg-white w-full py-6 border-b">
            <div className="container mx-auto flex justify-between">
              <div>
                <h2 className="font-display text-2xl text-emerald-700">
                  Kategorie
                </h2>
                <ul className="space-y-2 mt-4">
                  {categories.map((item) => (
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
              </div>
              <div>
                <h2 className="font-display text-2xl text-emerald-700">
                  Okazje
                </h2>
                <ul className="space-y-2 mt-4">
                  {occasions.map((item) => (
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
              </div>
              <div>
                <h2 className="font-display text-2xl text-emerald-700">
                  Kuchnie świata
                </h2>
                <ul className="space-y-2 mt-4 grid grid-cols-2 gap-x-8">
                  {cuisines.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/kategoria/${category.name}`}
                        className="text-sm hover:underline"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-2xl text-emerald-700">
                  Diety
                </h2>
                <ul className="space-y-2 mt-4">
                  {diets.map((item) => (
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
              </div>
            </div>
          </div>
        )}
      </Portal>
    </>
  );
};

export default NavItems;
