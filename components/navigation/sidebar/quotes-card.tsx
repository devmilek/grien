"use client";

import { QUOTES } from "@/config/quotes";
import { QuoteIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const QuotesCard = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0); // Start from 0

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % QUOTES.length);
      setProgress(0); // Reset the time elapsed
    }, 10000); // changes every 10 seconds

    const countdownId = setInterval(() => {
      setProgress((prevTime) => (prevTime < 100 ? prevTime + 1 : prevTime));
    }, 100); // Increase the time elapsed every second

    // Cleanup function to clear the intervals when the component unmounts
    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, []);

  return (
    <div className="bg-emerald-50 rounded-xl p-8">
      <h1 className="font-display text-2xl mb-4">Cytat</h1>
      <div className="flex space-x-3">
        <QuoteIcon className="h-10 w-10 text-emerald-600" />
        <div className="flex-1">
          <p className="text-neutral-600 text-sm">
            {QUOTES[currentQuoteIndex].quote}
          </p>
          <p className="text-end text-neutral-600 font-medium mt-1 text-sm">
            - {QUOTES[currentQuoteIndex].author}
          </p>
        </div>
      </div>
      <div
        className="h-1 rounded-full bg-emerald-600 transition-all mt-4"
        style={{ width: progress + "%" }}
      ></div>
    </div>
  );
};

export default QuotesCard;
