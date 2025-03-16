import Image from "next/image";
import React from "react";

const AttributeHero = ({
  name,
  description,
  src = "/food.jpg",
}: {
  name: string;
  description: string;
  src?: string;
}) => {
  return (
    <div className="h-96 w-full relative overflow-hidden rounded-xl">
      <div className="z-40 bg-black/60 size-full absolute flex items-center justify-center flex-col text-white p-8">
        <h1 className="font-display text-5xl mt-1">{name}</h1>
        <p className="text-sm mt-4 text-center">{description}</p>
      </div>
      <Image src={src} alt={"Zdjęcie " + name} fill className="object-cover" />
    </div>
  );
};

export default AttributeHero;
