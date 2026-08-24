import { Container } from "@chakra-ui/react";
import { Metadata } from "next";

import MobileShell from "@/components/layout/MobileShell";
import PageHeader from "@/components/layout/PageHeader";
import { PerfilForm } from "@/components/perfil/PerfilForm";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Meu perfil",
  description: "Página de gerenciamento do perfil do usuário",
};

export default async function PerfilPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <MobileShell>
        <PageHeader title="Meu perfil" backLink="/" />
        <Container maxW="md" py={4} pb={10}>
          <p>Você precisa estar logado para acessar esta página.</p>
        </Container>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <PageHeader title="Meu perfil" backLink="/" />
      <Container maxW="md" py={4} pb={10}>
        <PerfilForm profile={profile} />
      </Container>
    </MobileShell>
  );
}
