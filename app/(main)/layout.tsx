import Footer from "@/components/navigation/footer";
import Navbar from "@/components/navigation/navbar";
import { UtilityDataProvider } from "@/components/providers/utility-data-provider";
import { getUtilityData } from "@/data";
import { db } from "@/lib/db";
import React, { ReactNode, cache } from "react";

// TODO: cache the data

const fetchUtilityData = async () => {
  const baseurl = process.env.BASE_URL;
  const response = await fetch(baseurl + "api/utility-data", {
    next: {
      revalidate: 0,
    },
  });
  const data = await response.json();
  return data;
};

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const data = await fetchUtilityData();

  return (
    <UtilityDataProvider {...data}>
      <>
        <Navbar {...data} />
        <main className="pt-20 lg:pt-24 pb-16 min-h-screen container">
          {children}
        </main>
        <Footer {...data} />
      </>
    </UtilityDataProvider>
  );
};

export default MainLayout;
