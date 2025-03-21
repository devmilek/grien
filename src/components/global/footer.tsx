"use client";

import { useAttributes } from "@/hooks/use-attributes";
import { cn } from "@/lib/utils";
import { ChefHat } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const { data } = useAttributes();

  const items = [
    {
      name: "Kategorie",
      items: data?.categories,
    },
    {
      name: "Okazje",
      items: data?.occasions,
    },
    {
      name: "Kuchnie świata",
      items: data?.cuisines,
    },
    {
      name: "Diety",
      items: data?.diets,
    },
  ] as const;

  return (
    <footer className="container">
      <div className="bg-white rounded-2xl p-6 sm:p-12 flex gap-5 flex-col">
        <div className="max-w-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald-600 font-display"
          >
            <ChefHat />
            <span className="text-2xl text-foreground">grien</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-4">
            Odkryj kulinarne sekrety, Grien to pasja, inspiracja i smak, w
            jednym miejscu
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 auto-cols-auto">
          {items.map((item, index) => (
            <div
              key={item.name}
              className={cn({
                "lg:col-span-2": index === 2,
              })}
            >
              <h4 className="text-2xl font-display text-emerald-700">
                {item.name}
              </h4>
              <ul
                className={cn("mt-4 space-y-2 gap-x-4", {
                  "grid lg:grid-cols-2": item.name === "Kuchnie świata",
                })}
              >
                {item.items?.map((item) => (
                  <li
                    key={item.id}
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    <Link href={`/przepisy/${item.slug}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-start justify-between py-8 text-sm text-muted-foreground flex-col lg:flex-row">
        <p>© {new Date().getFullYear()} Grien. Wszelkie prawa zastrzeżone.</p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/regulamin">Regulamin</Link>
          {"|"}
          <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
          {"|"}
          <p>
            Stworzone od{" "}
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            przez{" "}
            <Link
              href="https://devmilek.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600"
            >
              devmilek
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
