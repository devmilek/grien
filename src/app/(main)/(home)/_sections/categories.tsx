"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Category } from "@/db/schema";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoriesSection = ({ categories }: { categories: Category[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();

  return (
    <section>
      <header className="flex items-center justify-between">
        <h2 className="font-display text-4xl mb-6">Kategorie</h2>
        <div className="space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight />
          </Button>
        </div>
      </header>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              // style={{
              //   flexBasis: "calc(1/8 * 100%)",
              // }}
              className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 xl:basis-1/10"
            >
              <Link className="group" href={`/kategorie/${category.slug}`}>
                <div className="aspect-square w-full bg-white rounded-full border flex items-center justify-center">
                  <Image
                    src={`/${category.slug}.jpg`}
                    height={200}
                    width={200}
                    alt={category.name}
                    className="aspect-square w-3/4 rounded-full group-hover:scale-105 transform transition-transform"
                  />
                </div>
                <p className=" text-center mt-4">{category.name}</p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default CategoriesSection;
