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
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Nie znaleziono konta",
  FAILED_TO_CREATE_SESSION: "Nie udało się utworzyć sesji",
  FAILED_TO_CREATE_USER: "Nie udało się utworzyć użytkownika",
  FAILED_TO_GET_SESSION: "Nie udało się pobrać sesji",
  FAILED_TO_GET_USER_INFO: "Nie udało się pobrać informacji o użytkowniku",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "Nie udało się odlinkować ostatniego konta",
  FAILED_TO_UPDATE_USER: "Nie udało się zaktualizować użytkownika",
  ID_TOKEN_NOT_SUPPORTED: "ID token nie jest obsługiwany",
  INVALID_EMAIL_OR_PASSWORD: "Nieprawidłowy email lub hasło",
  INVALID_TOKEN: "Nieprawiłdowy token",
  PROVIDER_NOT_FOUND: "Nie znaleziono dostawcy",
  SESSION_EXPIRED: "Sesja wygasła",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Konto społecznościowe jest już połączone",
  USER_EMAIL_NOT_FOUND: "Nie znaleziono adresu email użytkownika",
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
