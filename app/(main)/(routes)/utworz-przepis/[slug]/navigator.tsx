"use client";

import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  BookIcon,
  Footprints,
  NotebookPen,
  ShoppingBasket,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navigator = () => {
  const params = useParams();
  const editPath = "/a-new-recipe/" + params.slug;
  const pathname = usePathname();
  const items = [
    {
      icon: NotebookPen,
      title: "Podstawy",
      href: editPath + "/podstawy",
    },
    {
      icon: ShoppingBasket,
      title: "Składniki",
      href: editPath + "/skladniki",
    },
    {
      icon: Footprints,
      title: "Kroki przygotowania",
      href: editPath + "/kroki-przygotowania",
    },
    {
      icon: BadgeCheck,
      title: "Podsumowanie",
      href: editPath + "/podsumowanie",
    },
  ];
  return (
    <div className="flex justify-between">
      {items.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          className={cn(
            "flex items-center space-x-4 text-muted-foreground font-medium",
            {
              "text-neutral-900": pathname === item.href,
            },
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center h-12 w-12 rounded-xl border",
              {
                "bg-white shadow-sm text-emerald-600": pathname === item.href,
              },
            )}
          >
            <item.icon />
          </div>
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navigator;
