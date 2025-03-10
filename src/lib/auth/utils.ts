import { headers } from "next/headers";
import { auth } from ".";
import { cache } from "react";

export const getCurrentSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return {
      user: null,
      session: null,
    };
  }

  return session;
});
