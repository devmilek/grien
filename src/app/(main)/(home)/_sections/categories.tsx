"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Category } from "@/db/schema";
import Image from "next/image";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

const CategoriesSection = ({ categories }: { categories: Category[] }) => {
  return (
    <section>
      <h2 className="font-display text-4xl mb-6">Kategorie</h2>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnMouseEnter: true,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              style={{
                flexBasis: "calc(1/8 * 100%)",
              }}
            >
              <Link className="group" href={`/categories/${category.slug}`}>
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
