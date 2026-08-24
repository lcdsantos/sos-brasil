import MobileShell from "@/components/layout/MobileShell";
import PageHeader from "@/components/layout/PageHeader";
import { TermosDeUsoContent } from "@/components/termos-de-uso/TermosDeUsoContent";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Regras de uso da plataforma SOS Brasil.",
};

export default function TermosDeUsoPage() {
  return (
    <MobileShell>
      <PageHeader title="Termos de uso" backLink="/" />

      <TermosDeUsoContent />
    </MobileShell>
  );
}
