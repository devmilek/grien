import Footer from "@/components/navigation/footer";
import Navbar from "@/components/navigation/navbar";
import { UtilityDataProvider } from "@/components/providers/utility-data-provider";
import UserNameModal from "@/components/user-name-modal";
import { getUtilityData } from "@/data";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import React, { ReactNode, cache } from "react";

// TODO: cache the data

const fetchUtilityData = async () => {
  const attributes = await db.query.recipeAttribute.findMany({});
  const categories = await db.query.category.findMany({});
  return {
    attributes,
    categories,
  };
};

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const data = await fetchUtilityData();
  const session = await auth();

  if (session && !session.user.name) {
    return <UserNameModal />;
  }

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
