import Navbar from "@/components/global/navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-gray-50">{children}</main>
    </>
  );
};

export default MainLayout;
