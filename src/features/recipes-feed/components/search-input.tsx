import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import React from "react";
import { useDebounceCallback } from "usehooks-ts";

const SearchInput = ({ className }: { className?: string }) => {
  const [query, setQuery] = useQueryState(
    "szukaj",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    })
  );

  const updateQuery = useDebounceCallback((value: string) => {
    setQuery(value);
  }, 500);

  return (
    <div className={cn("relative", className)}>
      <Input
        className="peer ps-9"
        placeholder="Wyszukaj..."
        type="text"
        defaultValue={query}
        onChange={(e) => {
          updateQuery(e.target.value);
        }}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon className="size-4" aria-hidden="true" />
      </div>
    </div>
  );
};

export default SearchInput;
