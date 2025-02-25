import { Metadata } from "next";

const HOME_DOMAIN = process.env.BETTER_AUTH_URL!;

export function constructMetadata({
  title,
  fullTitle,
  description = "Dub.co is the open-source link management platform for modern marketing teams to create marketing campaigns, link sharing features, and referral programs.",
  image = "https://assets.dub.co/thumbnail.jpg",
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "https://assets.dub.co/favicons/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "https://assets.dub.co/favicons/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "https://assets.dub.co/favicons/favicon-16x16.png",
    },
  ],
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
    icons,
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
