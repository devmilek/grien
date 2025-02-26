"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimerIcon } from "lucide-react";
import React from "react";

const TimerPopover = ({ onSet }: { onSet: (seconds: number) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  const handleTimeChange = (
    value: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    max: number
  ) => {
    if (value >= 0 && value <= max) {
      setter(value);
    }
  };

  const handleSet = () => {
    onSet(hours * 3600 + minutes * 60 + seconds);
    setIsOpen(false);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(val) => {
        setIsOpen(val);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }}
    >
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <TimerIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top">
        {/* <h5 className="text-center text-lg mb-3 font-display font-semibold">Ustaw czas</h5> */}
        <div className="grid grid-cols-3 gap-1 mb-4">
          <div className="flex flex-col items-center">
            <input
              value={hours}
              onChange={(e) =>
                handleTimeChange(parseInt(e.target.value) || 0, setHours, 23)
              }
              className="w-16 h-16 text-2xl text-center rounded-lg border focus:ring-2 focus:ring-primary"
              min="0"
              max="23"
              placeholder="00"
            />
            <span className="text-xs text-muted-foreground mt-1">Godziny</span>
          </div>
          <div className="flex flex-col items-center">
            <input
              value={minutes}
              onChange={(e) =>
                handleTimeChange(parseInt(e.target.value) || 0, setMinutes, 59)
              }
              className="w-16 h-16 text-2xl text-center rounded-lg border focus:ring-2 focus:ring-primary"
              min="0"
              max="59"
              placeholder="00"
            />
            <span className="text-xs text-muted-foreground mt-1">Minuty</span>
          </div>
          <div className="flex flex-col items-center">
            <input
              value={seconds}
              onChange={(e) =>
                handleTimeChange(parseInt(e.target.value) || 0, setSeconds, 59)
              }
              className="w-16 h-16 text-2xl text-center rounded-lg border focus:ring-2 focus:ring-primary"
              min="0"
              max="59"
              placeholder="00"
            />
            <span className="text-xs text-muted-foreground mt-1">Sekundy</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Anuluj
          </Button>
          <Button variant="secondary" onClick={handleSet}>
            Ustaw
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimerPopover;
