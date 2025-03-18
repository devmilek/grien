import { Metadata } from "next";

const HOME_DOMAIN = process.env.NEXT_PUBLIC_BASE_URL!;

export function constructMetadata({
  title,
  fullTitle,
  description = "Grien to platforma dla kucharzy, na której możesz tworzyć, udostępniać i przeszukiwać przepisy kulinarne. Dołącz do naszej społeczności już dziś!",
  image = "/opengraph.png",
  url,
  canonicalUrl,
  noIndex = false,
  manifest,
  authors,
  category,
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata["icons"];
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  manifest?: string | URL | null;
  authors?: Metadata["authors"];
  category?: Metadata["category"];
} = {}): Metadata {
  return {
    applicationName: "Grien",
    category,
    title:
      fullTitle ||
      (title
        ? `${title} | Grien`
        : "Grien - Twoja kolekcja przepisów kulinarnych"),
    description,
    keywords: [
      "przepisy kulinarne",
      "książka kucharska",
      "gotowanie",
      "platforma dla kucharzy",
      "udostępnianie przepisów",
      "społeczność kucharzy",
      "przepisy domowe",
      "tworzenie przepisów",
    ],
    authors,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      url,
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      creator: "@devmilek",
    },
    metadataBase: new URL(HOME_DOMAIN),
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && {
      manifest,
    }),
  };
}
