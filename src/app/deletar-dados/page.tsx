import { DeletarDadosContent } from "@/components/deletar-dados/DeletarDadosContent";
import MobileShell from "@/components/layout/MobileShell";
import PageHeader from "@/components/layout/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exclusão de dados",
  description:
    "Instruções para solicitar a exclusão dos dados pessoais do usuário no SOS Brasil.",
};

export default function DeletarDadosPage() {
  return (
    <MobileShell>
      <PageHeader
        title="Exclusão de dados"
        backLink="/politica-de-privacidade"
      />

      <DeletarDadosContent />
    </MobileShell>
  );
}
