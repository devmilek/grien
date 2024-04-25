"use client";

import { UtilityData } from "@/types";
import { ReactNode, createContext, useContext } from "react";
interface UtilityDataProviderProps extends UtilityData {
  children: ReactNode;
}

export const UtilityDataContext = createContext<UtilityData>({
  categories: [],
  attributes: [],
});

export const UtilityDataProvider = ({
  children,
  categories,
  attributes,
}: UtilityDataProviderProps) => {
  return (
    <UtilityDataContext.Provider value={{ categories, attributes }}>
      {children}
    </UtilityDataContext.Provider>
  );
};

UtilityDataContext.displayName = "UtilityDataContext";

export function useUtilityData() {
  const context = useContext(UtilityDataContext);

  if (!context) {
    throw new Error("useUtilityData must be used within a UtilityDataProvider");
  }

  return context;
}
