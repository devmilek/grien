import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { auth } from ".";

export const authClient = createAuthClient({
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
  baseURL: "http://localhost:3000", // the base url of your auth server
});

type ErrorTypes = Partial<
  Record<keyof typeof authClient.$ERROR_CODES | string, string>
>;

const errorCodes = {
  USER_ALREADY_EXISTS: "Nazwa użytkownika jest już zajęta",
  ACCOUNT_NOT_FOUND: "Nie znaleziono konta",
  EMAIL_CAN_NOT_BE_UPDATED: "Nie można zmienić adresu email",
  EMAIL_NOT_VERIFIED: "Email nie został zweryfikowany",
  PASSWORD_TOO_SHORT: "Hasło jest za krótkie",
  PASSWORD_TOO_LONG: "Hasło jest za długie",
  INVALID_PASSWORD: "Nieprawidłowe hasło",
  INVALID_EMAIL: "Nieprawidłowy email",
  USER_NOT_FOUND: "Nie znaleziono użytkownika",
  USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER:
    "Nazwa użytkownika jest już zajęta",
} satisfies ErrorTypes;

export const getErrorMessage = (code?: string | null) => {
  if (!code) {
    return "Wystąpił błąd";
  }

  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes];
  }

  return "Wystąpił błąd";
};
