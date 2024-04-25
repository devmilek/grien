import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import * as React from "react";
import { Tailwind } from "@react-email/tailwind";
import { Container } from "@react-email/container";
import { Body } from "@react-email/body";
import { Link } from "@react-email/link";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Img } from "@react-email/components";
import { EMAIL_CONFIRMATION_HREF } from "@/config";

const baseUrl = process.env.BASE_URL;

interface MailConfirmationEmailProps {
  token: string;
}

export default function MailConfirmationEmail({
  token,
}: MailConfirmationEmailProps) {
  const confirmationLink =
    baseUrl + EMAIL_CONFIRMATION_HREF + "?token=" + token;
  return (
    <Tailwind>
      <Html className="bg-neutral-100 font-sans">
        <Body>
          <Container className="h-full w-full bg-neutral-100">
            <Container className="max-w-lg mx-auto pt-10">
              <Container className="w-full bg-white rounded-xl p-6 mt-6">
                <Container>
                  <Img src={baseUrl + "/logo.svg"} className="h-10 w-10" />
                  <Heading as="h1" className="text-2xl font-semibold">
                    Potwierdź swoją rejestrację
                  </Heading>
                </Container>
                <Text className="text-sm text-neutral-500 pt-2">
                  Oto twój kod weryfikacyjny, będzie on aktywny przez następne
                  24 godziny.
                </Text>
                <Link
                  href={confirmationLink}
                  className="cursor-pointer bg-emerald-600 px-5 py-3 mt-2 inline-block rounded-xl font-semibold text-white text-md"
                >
                  Potwierdź
                </Link>
                <Link
                  href={confirmationLink}
                  className="text-emerald-600 underline block mt-4 text-xs"
                >
                  {confirmationLink}
                </Link>
                <Container className="text-xs m-0 text-neutral-500">
                  <Text className="mb-0">Wesołego gotowania,</Text>
                  <Text className="m-0">Zespół Grief.</Text>
                </Container>
              </Container>
            </Container>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
