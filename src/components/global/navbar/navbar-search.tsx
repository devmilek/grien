"use client";

import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Loader2Icon, SearchIcon, TimerReset, TrashIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { navbarSearchRecipes } from "./actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

const MAX_RECENT_SEARCHES = 10;
const STORAGE_KEY = "recent-searches";

const NavbarSearch = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const addSearch = (search: string) => {
    const newSearches = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(newSearches);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["navbar-search-recipes", query],
    queryFn: async () => await navbarSearchRecipes(query),
    enabled: query.length > 0,
  });

  const handleSearch = () => {
    addSearch(query);
    router.push(`/szukaj/${query}`);
    setQuery("");
    setIsOpen(false);
  };

  const selectRecipe = (categorySlug: string, recipeSlug: string) => {
    addSearch(query);
    router.push(`/${categorySlug}/${recipeSlug}`);
    setQuery("");
    setIsOpen(false);
  };

  const setDebouncedQuery = useDebounceCallback(setQuery, 500);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      <CommandDialog
        open={isOpen}
        onOpenChange={(val) => {
          setQuery("");
          setIsOpen(val);
        }}
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Wyszukaj przepisu..."
          onValueChange={(val) => setDebouncedQuery(val)}
        />
        <CommandList>
          <CommandEmpty>
            {query ? "Brak wyników" : "Wpisz frazę, aby wyszukać przepis"}
          </CommandEmpty>
          {query && (
            <CommandGroup>
              <CommandItem onSelect={() => handleSearch()}>
                <SearchIcon />
                <span>Przejdź do wyszukiwania</span>
              </CommandItem>
            </CommandGroup>
          )}
          {query && data && data.length > 0 && (
            <CommandGroup
              heading={
                <div>
                  <span>Wyniki wyszukiwania</span>
                  {isLoading && <Loader2Icon className="size-3 animate-spin" />}
                </div>
              }
            >
              {data.map((recipe) => (
                <CommandItem
                  key={recipe.id}
                  onSelect={() =>
                    selectRecipe(recipe.category.slug, recipe.slug)
                  }
                >
                  {recipe.image && (
                    <Image
                      className="aspect-square rounded-lg object-cover w-12"
                      alt=""
                      width={200}
                      height={100}
                      unoptimized
                      src={recipe.image.url}
                    />
                  )}
                  <div>
                    <p className="font-medium">{recipe.name}</p>
                    <p className="text-muted-foreground">{recipe.user.name}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!query && recentSearches.length !== 0 && (
            <CommandGroup heading="Ostatnie wyszukiwania">
              {recentSearches.map((item, index) => (
                <CommandItem onSelect={() => addSearch(query)} key={index}>
                  <TimerReset />
                  <span>{item}</span>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => clearSearches()}>
                <TrashIcon />
                <span>Wyczyść historię</span>
              </CommandItem>
            </CommandGroup>
          )}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default NavbarSearch;
