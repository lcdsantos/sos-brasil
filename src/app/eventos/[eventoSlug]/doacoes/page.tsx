import { notFound } from "next/navigation";

import { Container, Heading, Stack } from "@chakra-ui/react";
import { Metadata } from "next";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";

import LocaisDoacaoList from "@/components/doacoes/LocaisDoacaoList";
import PriorityList from "@/components/doacoes/PriorityList";
import { createClient } from "@/lib/supabase/server";

type DoacoesPageProps = {
  params: Promise<{ eventoSlug: string }>;
};

export const metadata: Metadata = {
  title: "Doações",
  description: "Doações cadastradas no evento",
};

export default async function DoacoesPage(props: DoacoesPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  const [{ data: itens }, { data: locais }] = await Promise.all([
    supabase
      .from("doacao_itens_urgentes")
      .select("*, eventos!inner ( slug )")
      .eq("eventos.slug", params.eventoSlug)
      .order("prioridade")
      .order("item"),
    supabase
      .from("locais_doacao")
      .select("*, eventos!inner ( slug )")
      .eq("eventos.slug", params.eventoSlug)
      .order("nome"),
  ]);

  if (!itens || !locais) return notFound();

  const alta = itens?.filter((i) => i.prioridade === "alta") ?? [];
  const media = itens?.filter((i) => i.prioridade === "media") ?? [];
  const baixa = itens?.filter((i) => i.prioridade === "baixa") ?? [];

  return (
    <Container>
      <Heading as="h1" size="xl" py={6}>
        Doações
      </Heading>

      <Stack pb={4} gap={3}>
        <Heading as="h2" size="md">
          Itens Urgentes - Classificados por Prioridade
        </Heading>

        <PriorityList
          icon={<FcHighPriority />}
          label="Prioridade Alta"
          items={alta}
          bg="red.50"
        />

        <PriorityList
          icon={<FcMediumPriority />}
          label="Prioridade Média"
          items={media}
          bg="yellow.50"
        />

        <PriorityList
          icon={<FcLowPriority />}
          label="Prioridade Baixa"
          items={baixa}
          bg="green.50"
        />
      </Stack>

      <LocaisDoacaoList locais={locais} />
    </Container>
  );
}
