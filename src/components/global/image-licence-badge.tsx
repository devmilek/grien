import { Licence } from "@/db/schema";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { getDomainFromUrl } from "@/utils";
import { cn } from "@/lib/utils";

const ImageLicenceBadge = ({
  licence,
  className,
}: {
  licence: Licence;
  className?: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge
          className={cn("bg-background cursor-pointer", className)}
          variant="outline"
        >
          <InfoIcon />
          By: {licence.author}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="text-sm w-[300px] z-50">
        <p>
          Źródło: <span className="font-medium">{licence.originalTitle}</span> z{" "}
          <Link href={licence.sourceUrl} className="underline font-medium">
            {getDomainFromUrl(licence.sourceUrl)}
          </Link>
        </p>
        <p>
          Licencja:{" "}
          <Link href={licence.licenseLink} className="font-medium">
            {licence.licenseType}
          </Link>
        </p>
        <p>
          Autor zdjęcia: <span className="font-medium">{licence.author}</span>
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ImageLicenceBadge;
