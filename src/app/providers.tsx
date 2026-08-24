"use client";

import { ChakraProvider, Theme } from "@chakra-ui/react";

import { AuthProvider, Profile } from "@/components/layout/AuthProvider";
import { EmotionCacheProvider } from "@/components/layout/EmotionCacheProvider";
import { EventoProvider } from "@/components/layout/EventoProvider";
import { Toaster } from "@/components/ui/Toaster";
import { system } from "@/lib/theme";

type ProvidersProps = {
  profile?: Profile | null;
};

export default function Providers({
  children,
  profile,
}: React.PropsWithChildren<ProvidersProps>) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider value={system}>
        <Theme appearance="light" colorPalette="brand">
          <AuthProvider profile={profile}>
            <EventoProvider>
              <Toaster />
              {children}
            </EventoProvider>
          </AuthProvider>
        </Theme>
      </ChakraProvider>
    </EmotionCacheProvider>
  );
}
