"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecipeStep } from "@/db/schema";
import {
  ChevronLeft,
  PauseIcon,
  PlayIcon,
  TimerReset,
  XIcon,
} from "lucide-react";
import React from "react";
import { Image as DbImage } from "@/db/schema";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TimerPopover from "./timer-popover";
import { useTimer } from "react-timer-hook";

// Funkcja do ekstrakcji czasu z tekstu i formatowania tekstu
const extractTimeFromText = (text: string) => {
  const timeRegex = /(\b\d+\s*)(minut|godzin|sekund)(y|ę|a|)?\b/gi;
  let match;
  let timeInSeconds = 0;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  while ((match = timeRegex.exec(text)) !== null) {
    const start = match.index;
    const end = timeRegex.lastIndex;
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    // Dodaj tekst przed dopasowaniem
    if (start > lastIndex) {
      elements.push(text.slice(lastIndex, start));
    }

    // Oblicz czas w sekundach
    switch (unit) {
      case "godzin":
        timeInSeconds += value * 3600;
        break;
      case "minut":
        timeInSeconds += value * 60;
        break;
      case "sekund":
        timeInSeconds += value;
        break;
    }

    // Dodaj podkreślony fragment
    elements.push(
      <span key={start} className="text-primary font-medium">
        {text.slice(start, end)}
      </span>
    );

    lastIndex = end;
  }

  // Dodaj pozostały tekst
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return { timeInSeconds, processedText: elements };
};

const CookingModeModal = ({
  steps,
}: {
  steps: (RecipeStep & {
    image: DbImage | null;
  })[];
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [timer, setTimer] = React.useState(0);
  const [showTimer, setShowTimer] = React.useState(false);

  const time = new Date();
  time.setSeconds(time.getSeconds() + timer);

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    isRunning,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
  });

  // Automatycznie ustaw timer przy zmianie kroku
  React.useEffect(() => {
    const stepContent = steps[currentStep].content;
    const { timeInSeconds } = extractTimeFromText(stepContent);

    if (timeInSeconds > 0) {
      setTimer(timeInSeconds);
      setShowTimer(true);
      const newTime = new Date();
      newTime.setSeconds(newTime.getSeconds() + timeInSeconds);
      restart(newTime);
      pause();
    } else {
      setShowTimer(false);
      pause();
    }
  }, [currentStep, steps, restart, pause]);

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlayIcon />
          Tryb gotowania
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tryb gotowania</DialogTitle>
          <DialogDescription>
            Śledź kroki i przygotuj pyszne danie!
          </DialogDescription>
        </DialogHeader>
        {steps[currentStep].image && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={steps[currentStep].image.url}
              layout="fill"
              objectFit="cover"
              alt=""
            />
          </div>
        )}
        {/* stepper */}
        <div>
          <div className="flex gap-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn("h-1 w-full rounded-full bg-muted transition", {
                  "bg-primary": index <= currentStep,
                })}
              />
            ))}
          </div>
          <p className="font-medium mt-2">
            Krok {currentStep + 1} z {steps.length}
          </p>
        </div>
        <StepView step={steps[currentStep]} />
        {/* timer */}
        {showTimer && (
          <div>
            <div className="flex items-center justify-center gap-6">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  const time = new Date();
                  time.setSeconds(time.getSeconds() + timer);
                  restart(time);
                }}
              >
                <TimerReset />
              </Button>
              <div className="relative h-20 w-20">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-muted"
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    className="stroke-primary transition-all"
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    transform="rotate(-90 50 50)"
                    strokeDasharray={`${
                      ((timer - totalSeconds) / timer) * 283
                    } 283`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-medium">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => (isRunning ? pause() : resume())}
                  >
                    {isRunning ? <PauseIcon /> : <PlayIcon />}
                  </Button>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowTimer(false)}
              >
                <XIcon />
              </Button>
            </div>
            <div className="text-center font-medium mt-2">
              {hours > 0 && `${hours.toString().padStart(2, "0")}:`}
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="mr-auto"
            disabled={currentStep === 0}
            onClick={() => handleStepChange(currentStep - 1)}
          >
            <ChevronLeft />
          </Button>
          <TimerPopover
            onSet={(val) => {
              setTimer(val);
              setShowTimer(true);
              const time = new Date();
              time.setSeconds(time.getSeconds() + val);
              restart(time);
            }}
          />
          <Button
            onClick={() => handleStepChange(currentStep + 1)}
            disabled={currentStep === steps.length - 1}
          >
            Dalej
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StepView = ({ step }: { step: RecipeStep }) => {
  const { processedText } = extractTimeFromText(step.content);
  return <p className="text-sm">{processedText}</p>;
};

export default CookingModeModal;
