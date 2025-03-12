import { headers } from "next/headers";
import { auth, Session, User } from ".";
import { cache } from "react";

interface Data {
  user: User | null;
  session: Session | null;
}

export const getCurrentSession = cache(async () => {
  const data = (await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })) as Data;

  if (!data) {
    return {
      user: null,
      session: null,
    };
  }

  return data;
});
