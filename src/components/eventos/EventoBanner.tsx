"use client";

import { ReactNode } from "react";

import { useRouter, useSelectedLayoutSegment } from "next/navigation";

import { Box, Flex, Icon, IconButton, Text, Theme } from "@chakra-ui/react";
import { FaHillRockslide } from "react-icons/fa6";
import {
  RiAlertFill,
  RiArrowLeftLine,
  RiEarthquakeFill,
  RiFireFill,
  RiFloodFill,
  RiSunFill,
  RiTyphoonFill,
} from "react-icons/ri";

import { useEvento } from "@/components/layout/EventoProvider";
import LoginButton from "@/components/layout/LoginButton";
import type { Enums, Tables } from "@/types/database";

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

type Evento = Tables<"eventos">;

type EventoBannerProps = {
  evento: Evento;
};

export default function EventoBanner({ evento }: EventoBannerProps) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  const { limparEvento } = useEvento();

  const handleBack = () => {
    if (!segment) {
      limparEvento();
      router.push("/");
    } else {
      router.push(`/eventos/${evento.slug}`);
    }
  };

  return (
    <Theme appearance="dark" bg="brand.700" colorPalette="brand">
      <Flex align="center" gap={4} px={4} py={3}>
        <IconButton
          aria-label="Voltar"
          onClick={handleBack}
          variant="ghost"
          color="white"
          _hover={{ bg: "brand.600" }}
        >
          <RiArrowLeftLine size={20} />
        </IconButton>

        <Icon size="xl">{TIPO_ICON[evento.tipo]}</Icon>

        <Box flex={1} minW={0}>
          <Text as="h1" fontWeight={700} lineClamp={1}>
            {evento.nome}
          </Text>
          <Text textStyle="xs" color="brand.200">
            {evento.localidade} · {evento.estado}
          </Text>
        </Box>

        <LoginButton inverted />
      </Flex>
    </Theme>
  );
}
