"use client";

import Image from "next/image";
import React from "react";

const Hero = ({ query }: { query: string }) => {
  return (
    <div className="h-96 w-full relative overflow-hidden rounded-xl mb-8">
      <div className="z-40 bg-black/60 size-full absolute flex items-center justify-center flex-col text-white">
        <p className="font-semibold">Wyniki wyszukiwania dla:</p>
        <h1 className="font-display text-5xl">{query}</h1>
      </div>
      <Image src="/food.jpg" alt="" fill objectFit="cover" />
    </div>
  );
};

export default Hero;
