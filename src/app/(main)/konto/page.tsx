import { getCurrentSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import React from "react";
import RecipesFeed from "./recipes-feed";
import { Metadata } from "next";
import { constructMetadata } from "@/utils/construct-metadata";
import UserProfileHeaderSection from "@/features/user-profile/components/user-profile-header-section";

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
      <UserProfileHeaderSection />
      <RecipesFeed userId={user.id} />
    </div>
  );
};

export default ProfilePage;
