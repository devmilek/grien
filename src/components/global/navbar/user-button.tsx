import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

const UserButton = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <Avatar>
        <AvatarFallback>MK</AvatarFallback>
      </Avatar>
      <p className="text-sm">Jamie</p>
    </div>
  );
};

export default UserButton;
