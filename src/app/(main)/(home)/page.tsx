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

export const metadata: Metadata = constructMetadata();

export default async function Home() {
  const categories = await db.query.categories.findMany();
  return (
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
  );
}
