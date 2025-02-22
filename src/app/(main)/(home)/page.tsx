import db from "@/db";
import HeroSection from "./_sections/hero";
import CategoriesSection from "./_sections/categories";
import PopularFeed from "./_sections/popular-feed";
import MainDishesFeed from "./_sections/main-dishes-feed";
import OtherRecipesFeed from "./_sections/other-recipes-feed";
import QuoteCard from "./_sections/quote-card";

export default async function Home() {
  const categories = await db.query.categories.findMany();
  return (
    <div className="container mx-auto space-y-10">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <div className="flex gap-8">
        <div className="flex-1 space-y-8">
          <PopularFeed />
          <MainDishesFeed />
        </div>
        <div className="w-[350px]">
          <QuoteCard />
        </div>
      </div>
      <OtherRecipesFeed />
    </div>
  );
}
