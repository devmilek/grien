import ImageLicenceBadge from "@/components/global/image-licence-badge";
import { Licence } from "@/db/schema";
import Image from "next/image";
import React from "react";

const RecipeImage = ({
  imageUrl,
  licence,
}: {
  imageUrl: string;
  licence: Licence | null;
}) => {
  return (
    <div className="w-full relative aspect-[4/3] rounded-lg overflow-hidden">
      <Image fill alt="" src={imageUrl} className="objec" objectFit="cover" />
      {licence && (
        <ImageLicenceBadge
          licence={licence}
          className="absolute z-40 right-4 bottom-4 "
        />
      )}
    </div>
  );
};

export default RecipeImage;
