import { getCurrentSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/utils/construct-metadata";
import UserProfileHeaderSection from "@/features/user-profile/components/user-profile-header-section";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";

export const metadata: Metadata = constructMetadata({
  title: "Twoje konto",
  noIndex: true,
});

const ProfilePage = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/logowanie");
  }

  return (
    <div className="container">
      <UserProfileHeaderSection userId={user.id} />
      {user.username && <RecipesFeed username={user.username} />}
    </div>
  );
};

export default ProfilePage;
