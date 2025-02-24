"use client";

import { countFilteredRecipes } from "@/actions/get-filtered-recipes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import React from "react";

const Hero = ({ query }: { query: string }) => {
  const [categorySlug] = useQueryState("kategoria", parseAsString);
  const [cuisineSlugs] = useQueryState(
    "kuchnie",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [occassionSlugs] = useQueryState(
    "okazje",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [dietSlugs] = useQueryState(
    "diety",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const { data } = useQuery({
    queryKey: [
      "recipes",
      "count",
      {
        categorySlug,
        cuisineSlugs,
        occassionSlugs,
        dietSlugs,
        query,
      },
    ],
    queryFn: async () =>
      countFilteredRecipes({
        categorySlug,
        cuisineSlugs,
        dietSlugs,
        occassionSlugs,
        query,
      }),
  });
  return (
    <div className="h-96 w-full relative overflow-hidden rounded-xl">
      <div className="z-40 bg-black/60 size-full absolute flex items-center justify-center flex-col text-white">
        <p className="font-semibold">Wyniki wyszukiwania</p>
        <h1 className="font-display text-5xl">{query}</h1>
        <p className="text-sm mt-2">
          Znaleziono <span className="font-semibold">{data}</span> wyników
        </p>
      </div>
      <Image src="/food.jpg" alt="" fill objectFit="cover" />
    </div>
  );
};

export default Hero;
