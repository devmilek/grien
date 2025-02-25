import React from "react";
import CompleteProfileForm from "../_components/complete-profile-form";
import { getCurrentSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import db from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Uzupełnij profil",
  description:
    "Pozwól innym użytkowniką cie rozpoznać uzupełniając poniższe pola.",
  noIndex: true,
});

const Page = async () => {
  const { session } = await getCurrentSession();

  if (!session) return redirect("/sign-in");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) return redirect("/sign-in");

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-display">Uzupełnij profil</h1>
        <p className="text-muted-foreground text-sm">
          Pozwól innym użytkowniką cie rozpoznać uzupełniając poniższe pola.
        </p>
      </header>
      <CompleteProfileForm user={user} />
    </div>
  );
};

export default Page;
