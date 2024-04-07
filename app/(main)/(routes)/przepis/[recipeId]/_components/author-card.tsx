import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface AuthorCardProps {
  user: User;
}

const AuthorCard = ({ user }: AuthorCardProps) => {
  return (
    <div className="bg-white rounded-xl p-8 flex space-x-4">
      <Avatar className="">
        <AvatarFallback className="uppercase">
          {user.name?.slice(0, 2)}
        </AvatarFallback>
        {user.image && <AvatarImage src={user.image} />}
      </Avatar>
      <div>
        <p className="text-xs text-neutral-500">Napisane przez</p>
        <h2 className="font-semibold">{user.name}</h2>
        <p className="text-sm text-neutral-500 mt-2">{user.bio}</p>
      </div>
    </div>
  );
};

export default AuthorCard;
