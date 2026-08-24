import { Stack, Heading, Flex, Tag, Text } from "@chakra-ui/react";

import { Enums, Tables } from "@/types/database";

type NoticiaCardProps = {
  noticia: Tables<"noticias">;
};

const TAG_STYLE: Record<
  Enums<"noticia_tag_enum">,
  { bg: string; color: string; label: string }
> = {
  alerta: { bg: "red.100", color: "red.700", label: "Alerta" },
  informativo: { bg: "blue.100", color: "blue.700", label: "Informativo" },
  boas_noticias: {
    bg: "green.100",
    color: "green.700",
    label: "Boas notícias",
  },
  transito: { bg: "gray.100", color: "gray.700", label: "Trânsito" },
  previsao_tempo: {
    bg: "yellow.100",
    color: "yellow.800",
    label: "Previsão do tempo",
  },
};

export const NoticiaCard = ({ noticia }: NoticiaCardProps) => {
  const tag = TAG_STYLE[noticia.tag];
  const date = new Date(noticia.publicado_em).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Stack
      border="1px solid"
      borderColor="brand.200"
      borderRadius="14px"
      p={4}
      gap={2}
    >
      <Heading as="h2">{noticia.titulo}</Heading>

      <Flex justify="space-between" align="center" gap={2}>
        <Tag.Root bg={tag.bg} color={tag.color}>
          <Tag.Label>{tag.label}</Tag.Label>
        </Tag.Root>

        <Text textStyle="xs">{date}</Text>
      </Flex>

      <Text textStyle="md" lineHeight={1.6}>
        {noticia.texto}
      </Text>

      {noticia.fonte && (
        <Text textStyle="xs" textAlign="right" color="fg.muted">
          Fonte: {noticia.fonte}
        </Text>
      )}
    </Stack>
  );
};
