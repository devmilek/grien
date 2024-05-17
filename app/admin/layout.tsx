import React, { PropsWithChildren } from "react";
import Sidebar from "./_components/sidebar";

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="">
      <Sidebar />
      <div className="ml-72 p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
