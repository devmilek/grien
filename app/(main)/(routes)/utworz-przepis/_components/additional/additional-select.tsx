import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import React from "react";

export type AdditionalItem = {
  id: string;
  name: string;
  slug: string;
};

interface AdditionalSelectProps {
  unselectedItems: AdditionalItem[];
  selectedItems?: AdditionalItem[];
  placeholder: string;
  addFn: (id: string) => void;
  removeFn: (id: string) => void;
  disabled: boolean;
}

export const AdditionalSelect = React.memo(
  ({
    unselectedItems,
    selectedItems,
    placeholder,
    addFn,
    removeFn,
    disabled,
  }: AdditionalSelectProps) => {
    return (
      <div>
        <Select disabled={disabled} value="" onValueChange={addFn}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="max-h-60">
              {unselectedItems?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
              {!unselectedItems?.length && (
                <div className="text-center text-muted-foreground text-xs py-4">
                  Brak dostępnych opcji
                </div>
              )}
            </ScrollArea>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedItems?.map((data) => (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-neutral-200"
              key={data.id}
              onClick={() => {
                removeFn(data.id);
              }}
            >
              {data.name}
              <XIcon className="ml-2 h-2 w-2" />
            </Badge>
          ))}
        </div>
      </div>
    );
  },
);

AdditionalSelect.displayName = "AdditionalSelect";

export const AdditionalSelectx = ({
  unselectedItems,
  selectedItems,
  placeholder,
  addFn,
  removeFn,
}: AdditionalSelectProps) => {
  console.log("render", placeholder);
  return (
    <div>
      <Select value="" onValueChange={addFn}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="max-h-60">
            {unselectedItems?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
            {!unselectedItems?.length && (
              <div className="text-center text-muted-foreground text-xs py-4">
                Brak dostępnych opcji
              </div>
            )}
          </ScrollArea>
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedItems?.map((data) => (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-neutral-200"
            key={data.id}
            onClick={() => {
              removeFn(data.id);
            }}
          >
            {data.name}
            <XIcon className="ml-2 h-2 w-2" />
          </Badge>
        ))}
      </div>
    </div>
  );
};
