"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const timeEntries = [
  {
    value: "10",
    label: "10 minut",
  },
  {
    value: "20",
    label: "20 minut",
  },
  {
    value: "30",
    label: "30 minut",
  },
  {
    value: "40",
    label: "40 minut",
  },
  {
    value: "50",
    label: "50 minut",
  },
  {
    value: "60",
    label: "1 godzina",
  },
  {
    value: "75",
    label: "1 godzina 15 minut",
  },
  {
    value: "90",
    label: "1 godzina 30 minut",
  },
  {
    value: "105",
    label: "1 godzina 45 minut",
  },
  {
    value: "120",
    label: "2 godziny",
  },
];

export function TimeCombobox({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal w-full", {
            "text-muted-foreground": !value,
          })}
        >
          {value
            ? timeEntries.find((item) => item.value === value.toString())?.label
            : "Wybierz czas..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Wyszukaj czasu..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {timeEntries.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(
                      currentValue === value?.toString()
                        ? 0
                        : Number(currentValue)
                    );
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value?.toString() === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
