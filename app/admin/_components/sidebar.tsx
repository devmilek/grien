import Link from "next/link";
import React from "react";

const Sidebar = () => {
  const sidebarItems = [
    {
      href: "/admin/recipes",
      label: "Przepisy",
    },
  ];
  return (
    <div className="fixed bg-gray-100 w-72 h-full left-0 p-8">
      {sidebarItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="block p-2 rounded-md hover:bg-gray-200"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
