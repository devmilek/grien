import db from "@/db";
import HeroSection from "./_sections/hero";
import CategoriesSection from "./_sections/categories";
import PopularFeed from "./_sections/popular-feed";
import MainDishesFeed from "./_sections/main-dishes-feed";
import QuoteCard from "./_sections/quote-card";
import DrinksFeed from "./_sections/drinks-feed";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";
import UsersFeed from "./_sections/users-feed";
import type { Graph } from "schema-dts";

export const metadata: Metadata = constructMetadata();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const graph: Graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": BASE_URL + "/#website",
      name: "Grien",
      alternateName: ["Grien", "Przepisy Grien", "Grien Przepisy"],
      url: BASE_URL,
      description:
        "Grien to platforma dla kucharzy, na której możesz tworzyć, udostępniać i przeszukiwać przepisy kulinarne. Dołącz do naszej społeczności już dziś!",
      keywords: "kuchnia, przepisy, gotowanie, jedzenie",
      image: {
        "@type": "ImageObject",
        "@id": BASE_URL + "/#logo",
        url: BASE_URL + "/logo.svg",
        caption: "Logo strony",
      },
      publisher: {
        "@type": "Organization",
        "@id": BASE_URL + "/#organization",
        name: "Grien",
        logo: {
          "@type": "ImageObject",
          url: BASE_URL + "/logo.svg",
          width: "100",
          height: "100",
        },
      },
      potentialAction: {
        "@type": "SearchAction",
        target: BASE_URL + "/search?q={search_term_string}",
        query: "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": BASE_URL + "/#webpage",
      url: BASE_URL,
      name: "Strona Główna | Grien",
      isPartOf: { "@id": "https://example.com/#website" },
      datePublished: "2025-03-18",
      dateModified: new Date().toISOString(),
      primaryImageOfPage: { "@id": BASE_URL + "/#logo" },
      mainEntityOfPage: BASE_URL + "/#webpage",
    },
  ],
};

export default async function Home() {
  const categories = await db.query.categories.findMany();
  return (
    <>
      <div className="container mx-auto space-y-10">
        <HeroSection />
        <CategoriesSection categories={categories} />
        <div className="flex gap-8 flex-col-reverse lg:flex-row">
          <div className="flex-1 space-y-8">
            <PopularFeed />
            <MainDishesFeed />
          </div>
          <div className="lg:w-[350px] space-y-4">
            <UsersFeed />
            <QuoteCard />
            <DrinksFeed />
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
    </>
  );
}
