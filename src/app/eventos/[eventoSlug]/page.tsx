import { notFound } from "next/navigation";

import { Container, SimpleGrid } from "@chakra-ui/react";
import { Metadata } from "next";
import {
  RiHandHeartFill,
  RiRoadMapFill,
  RiNewspaperFill,
  RiHomeHeartFill,
} from "react-icons/ri";

import TileCard from "@/components/ui/TileCard";
import { getEvento } from "@/lib/data";

type EventoDashboardPageProps = {
  params: Promise<{ eventoSlug: string }>;
};

export async function generateMetadata(
  props: EventoDashboardPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const evento = await getEvento({ eventoSlug: params.eventoSlug });

  if (evento) {
    return {
      title: evento.nome,
      description: `Página de gerenciamento do evento ${evento.nome}`,
    };
  }

  return {
    title: "Eventos",
    description: "Página de gerenciamento de eventos",
  };
}

export default async function EventoDashboardPage(
  props: EventoDashboardPageProps,
) {
  const params = await props.params;
  const evento = await getEvento({ eventoSlug: params.eventoSlug });

  if (!evento) return notFound();

  const TILES = [
    {
      href: "abrigos",
      icon: <RiHomeHeartFill size={48} />,
      title: "Abrigos",
      subTitle: "Locais de acolhimento",
    },
    {
      href: "doacoes",
      icon: <RiHandHeartFill size={48} />,
      title: "Doações",
      subTitle: "Itens e pontos de coleta",
    },
    {
      href: "vias-interditadas",
      icon: <RiRoadMapFill size={48} />,
      title: "Vias Interditadas",
      subTitle: "Bloqueios e alertas",
    },
    {
      href: "noticias",
      icon: <RiNewspaperFill size={48} />,
      title: "Notícias",
      subTitle: "Últimas informações",
    },
  ];

  return (
    <Container>
      <SimpleGrid columns={2} gap="4" py="6">
        {TILES.map(({ href, ...props }) => (
          <TileCard
            key={href}
            href={`/eventos/${evento.slug}/${href}`}
            {...props}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
