import FacatedSearch from "@/components/global/facated-search";
import React from "react";
import RecipesFeed from "./_components/recipes-feed";
import Hero from "./_components/hero";

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
      <div className="flex mt-5 gap-6">
        <div className="w-[300px] shrink-0">
          <FacatedSearch />
        </div>
        <div className="flex-1">
          <RecipesFeed query={query} />
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
