import { Roboto_Flex, Roboto_Serif } from "next/font/google";

import { GoogleAnalytics } from "@next/third-parties/google";

import Providers from "@/app/providers";
import { getProfile } from "@/lib/data";

import type { Metadata } from "next";

// Material Design 3 fonts loaded via next/font (no external <link> needed)
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap",
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-roboto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "SOS Brasil", template: "%s — SOS Brasil" },
  description: "Plataforma de apoio em situações de emergência",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <html
      lang="pt-BR"
      className={`${robotoFlex.variable} ${robotoSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-16x16.png"
          sizes="16x16"
        />
      </head>

      <body>
        <Providers profile={profile}>{children}</Providers>
      </body>

      <GoogleAnalytics gaId="G-ZSPGE95R3K" />
    </html>
  );
}
