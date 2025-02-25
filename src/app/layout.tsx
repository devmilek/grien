import { DM_Serif_Display, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--dm-serif-display",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerifDisplay.variable} ${poppins.className} antialiased`}
      >
        <NuqsAdapter>
          <QueryProvider>
            {children}
            <Toaster theme="light" />
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
