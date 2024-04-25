import { FOOTER_LINKS_PER_COLUMN, SITE_NAME } from "@/config";
import { UtilityData } from "@/types";
import { ChefHat } from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";

const Footer = async ({ categories, attributes }: UtilityData) => {
  const items = [
    {
      title: "Kategorie",
      items: categories,
    },
    {
      title: "Okazje",
      items: attributes?.filter((attr) => attr.type === "occasion"),
    },
    {
      title: "Kuchnie świata",
      items: attributes?.filter((attr) => attr.type === "cuisine"),
    },
    {
      title: "Diety",
      items: attributes?.filter((attr) => attr.type === "diet"),
    },
  ];

  return (
    <footer className="container">
      <div className="rounded-xl p-5 lg:p-10 bg-white flex xl:space-x-8 flex-col xl:flex-row">
        <div className="xl:max-w-xs mb-10 xl:mb-0">
          <Link href="/" className="flex items-center">
            <ChefHat className="h-6 w-6 mr-2 text-emerald-600" />
            <p className="font-display text-2xl">{SITE_NAME}</p>
          </Link>
          <p className="text-neutral-500 text-sm mt-2">
            Odkryj kulinarne sekrety, {SITE_NAME} to pasja, inspiracja i smak, w
            jednym miejscu
          </p>
        </div>
        <div className="gap-x-4 gap-y-8 grid grid-cols-2 md:grid-cols-4 w-full">
          {items.map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-emerald-600 text-2xl">
                {item.title}
              </h2>
              <div className="space-y-2 flex flex-col mt-4">
                {item.items.slice(0, FOOTER_LINKS_PER_COLUMN).map((link) => {
                  return (
                    <Fragment key={link.id}>
                      <Link href="/" className="text-sm">
                        {link.name}
                      </Link>
                    </Fragment>
                  );
                })}
                {item.items.length > FOOTER_LINKS_PER_COLUMN && (
                  <p className="text-sm font-medium">
                    {item.items.length - FOOTER_LINKS_PER_COLUMN} więcej
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Copyright */}
      <div className="text-sm text-neutral-500 flex items-center justify-between py-8 ">
        <p>Copyright © 2023 {SITE_NAME}</p>
        <p>by: @devmilek</p>
      </div>
    </footer>
  );
};

export default Footer;
