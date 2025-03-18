import React from "react";
import db from "@/db";
import { users } from "@/db/schema";
import { getTableColumns } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils";
import Link from "next/link";

const UsersFeed = async () => {
  const data = await db
    .select({
      ...getTableColumns(users),
    })
    .from(users)
    .limit(3);

  return (
    <div className="p-6 bg-white rounded-xl">
      <h3 className="text-2xl font-display">Popularni kucharze</h3>
      <div className="space-y-4 mt-4">
        {data.map((user) => (
          <Link
            href={"/kucharze/" + user.username}
            className="flex items-center gap-4 group"
            key={user.id}
          >
            <Avatar className="size-14">
              {user.image && <AvatarImage src={user.image} />}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold group-hover:underline">
                {user.name}
              </h4>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UsersFeed;
