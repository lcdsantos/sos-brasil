import { notFound } from "next/navigation";

import { Container, Heading, VStack } from "@chakra-ui/react";
import { Metadata } from "next";

import { NoticiaCard } from "@/components/noticias/NoticiaCard";
import { createClient } from "@/lib/supabase/server";

type NoticiasPageProps = {
  params: Promise<{ eventoSlug: string }>;
};

export const metadata: Metadata = {
  title: "Notícias",
  description: "Notícias sobre o evento",
};

export default async function NoticiasPage(props: NoticiasPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  const [{ data: noticias }] = await Promise.all([
    supabase
      .from("noticias")
      .select("*, eventos!inner ( slug )")
      .eq("eventos.slug", params.eventoSlug)
      .order("publicado_em", { ascending: false }),
  ]);

  if (!noticias) return notFound();

  return (
    <Container>
      <Heading as="h1" size="xl" px={4} py={6}>
        Notícias
      </Heading>

      <VStack px={4} pb={6} gap={3} align="stretch">
        {noticias?.map((noticia) => (
          <NoticiaCard key={noticia.id} noticia={noticia} />
        ))}
      </VStack>
    </Container>
  );
}
