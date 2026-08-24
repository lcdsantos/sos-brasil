import MobileShell from "@/components/layout/MobileShell";
import PageHeader from "@/components/layout/PageHeader";
import { PoliticaPrivacidadeContent } from "@/components/politica-de-privacidade/PoliticaPrivacidadeContent";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Informações sobre a coleta, uso e proteção de dados no SOS Brasil.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <MobileShell>
      <PageHeader title="Política de privacidade" backLink="/" />

      <PoliticaPrivacidadeContent />
    </MobileShell>
  );
}
