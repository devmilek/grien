import React from "react";
import Hero from "./_components/hero";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";

const SearchResultsPage = async ({
  params,
}: {
  params: Promise<{
    query: string;
  }>;
}) => {
  const query = (await params).query;
  return (
    <div className="container">
      <Hero query={query} />
      <RecipesFeed query={query} />
    </div>
  );
};

export default SearchResultsPage;
