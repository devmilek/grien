import db from "@/db";
import HeroSection from "./_sections/hero";
import CategoriesSection from "./_sections/categories";

export default async function Home() {
  const categories = await db.query.categories.findMany();
  return (
    <div className="container mx-auto space-y-10">
      <HeroSection />
      <CategoriesSection categories={categories} />
    </div>
  );
}
