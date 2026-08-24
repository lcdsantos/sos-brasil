"use client";

import { ReactNode } from "react";

import {
  Badge,
  BadgeProps,
  Center,
  Flex,
  Icon,
  Link,
  Text,
} from "@chakra-ui/react";
import { FaHillRockslide, FaMapPin } from "react-icons/fa6";
import {
  RiAlertFill,
  RiEarthquakeFill,
  RiFireFill,
  RiFloodFill,
  RiSunFill,
  RiTyphoonFill,
} from "react-icons/ri";

import { useEvento } from "@/components/layout/EventoProvider";
import Card from "@/components/ui/Card";
import type { Enums, Tables } from "@/types/database";

type Evento = Tables<"eventos">;
type EventoStatusEnum = Enums<"evento_status_enum">;
type EventoTipoEnum = Enums<"evento_tipo_enum">;

const TIPO_ICON: Record<EventoTipoEnum, ReactNode> = {
  enchente: <RiFloodFill />, // "🌊",
  ciclone: <RiTyphoonFill />, // "🌀",
  incendio: <RiFireFill />, // "🔥",
  seca: <RiSunFill />, // "☀️",
  deslizamento: <FaHillRockslide />, // "🏔️",
  terremoto: <RiEarthquakeFill />, // "🏚️",
  outro: <RiAlertFill />, // "⚠️",
};

const STATUS_STYLE: Record<
  EventoStatusEnum,
  { label: string } & Pick<BadgeProps, "colorPalette">
> = {
  ativo: { colorPalette: "red", label: "Ativo" },
  monitoramento: {
    colorPalette: "yellow",
    label: "Monitoramento",
  },
  encerrado: { colorPalette: "green", label: "Encerrado" },
};

export default function EventoCard({ evento }: { evento: Evento }) {
  const { setEventoAtual } = useEvento();

  const status = STATUS_STYLE[evento.status];

  const handleClick = () => {
    setEventoAtual(evento);
  };

  const dataInicio = new Date(evento.data_inicio).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card p={5} gap={5} onClick={handleClick} asChild>
      <Link href={`/eventos/${evento.slug}`}>
        <Center
          as="span"
          w={12}
          h={12}
          bg="brand.50"
          rounded="lg"
          textStyle="2xl"
          flexShrink={0}
        >
          <Icon aria-hidden="true">{TIPO_ICON[evento.tipo]}</Icon>
        </Center>

        <Flex
          as="span"
          flex={1}
          minW={0}
          flexDirection="column"
          alignItems="flex-start"
          gap={2}
        >
          <Text as="span" textStyle="md" fontWeight={700}>
            {evento.nome}
          </Text>
          <Flex as="span" alignItems="center">
            <Icon size="sm" aria-hidden="true" mr={2}>
              <FaMapPin />
            </Icon>
            <Text as="span" textStyle="sm" color="brand.600">
              {evento.localidade} · {dataInicio}
            </Text>
          </Flex>
          {evento.descricao && (
            <Text as="span" textStyle="sm" color="brand.700" lineClamp={2}>
              {evento.descricao}
            </Text>
          )}
          <Badge colorPalette={status.colorPalette}>{status.label}</Badge>
        </Flex>
      </Link>
    </Card>
  );
}
