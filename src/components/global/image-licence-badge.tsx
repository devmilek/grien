import { Licence } from "@/db/schema";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CreativeCommons } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { getDomainFromUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { HoverCardPortal } from "@radix-ui/react-hover-card";

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
          className={cn(
            "bg-background cursor-pointer pointer-events-auto",
            className
          )}
          variant="outline"
        >
          <CreativeCommons />
          {licence.imagesAuthor
            ? `By: ${licence.imagesAuthor}`
            : licence.licenseType}
        </Badge>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent className="text-sm w-[300px] z-50">
          <p>
            Źródło: <span className="font-medium">{licence.originalTitle}</span>{" "}
            z{" "}
            <Link
              href={licence.sourceUrl}
              className="underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
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
            Autor przepisu:{" "}
            <span className="font-medium">{licence.author}</span>
          </p>
          {licence.imagesAuthor && (
            <p>
              Autor zdjęcia:{" "}
              <span className="font-medium">{licence.imagesAuthor}</span>
            </p>
          )}
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
};

export default ImageLicenceBadge;
