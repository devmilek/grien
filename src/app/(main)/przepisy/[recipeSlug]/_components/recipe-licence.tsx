import { Licence } from "@/db/schema";
import { getDomainFromUrl } from "@/utils";
import Link from "next/link";
import React from "react";

const RecipeLicence = ({ licence }: { licence: Licence }) => {
  return (
    <div className="p-6 rounded-xl border bg-white text-sm space-y-1">
      <p className="">
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
        Autor przepisu: <span className="font-medium">{licence.author}</span>
      </p>
      {licence.imagesAuthor && (
        <p>
          Autor zdjęć:{" "}
          <span className="font-medium">{licence.imagesAuthor}</span>
        </p>
      )}
      <p>
        Ten przepis został przetłumaczony na język polski i dostosowany do miar
        metrycznych. Możesz go udostępniać i modyfikować na tych samych
        warunkach.
      </p>
    </div>
  );
};

export default RecipeLicence;
