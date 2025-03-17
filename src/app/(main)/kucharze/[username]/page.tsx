import db from "@/db";
import { users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/utils/construct-metadata";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";
import UserProfileHeaderSection from "@/features/user-profile/components/user-profile-header-section";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const username = (await params).username;
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return {};
  }

  return constructMetadata({
    title: "Kucharz " + user.name,
    url: `/kucharze/${user.username}`,
    noIndex: true,
  });
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { user: currentUser } = await getCurrentSession();
  const username = (await params).username;

  if (username === currentUser?.username) redirect("/konto");

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="container">
      <UserProfileHeaderSection userId={user.id} />
      <div className="p-8 mb-6 bg-white rounded-2xl">
        <h2 className="font-display text-xl mb-3">Bio</h2>
        <p className="text-sm text-muted-foreground">{user.bio}</p>
      </div>
      {user.username && <RecipesFeed username={user.username} />}
    </div>
  );
};

export default ProfilePage;
