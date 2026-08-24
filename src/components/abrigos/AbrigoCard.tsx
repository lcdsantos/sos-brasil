import Link from "next/link";
import { useParams } from "next/navigation";

import { Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { FuseResultMatch } from "fuse.js";
import { RiHome2Fill } from "react-icons/ri";

import { highlightMatches } from "@/components/ui/SearchHighlight";
import type { Tables } from "@/types/database";

type AbrigoCardProps = {
  abrigo: Tables<"abrigos_com_contagem">;
  matches?: ReadonlyArray<FuseResultMatch> | null;
};

export default function AbrigoCard({ abrigo, matches }: AbrigoCardProps) {
  const params = useParams();
  const nomeMatch = matches?.find((m) => m?.key === "nome");

  return (
    <Box
      bg="brand.100"
      border="1px solid"
      borderColor="brand.200"
      borderRadius="md"
      p={4}
    >
      <Flex gap={3} mb={3}>
        {abrigo.foto_url ? (
          <Image
            src={abrigo.foto_url}
            alt={abrigo.nome ?? "Abrigo"}
            w="12"
            h="12"
            objectFit="cover"
            borderRadius="full"
            flexShrink={0}
          />
        ) : (
          <Flex
            w="12"
            h="12"
            borderRadius="full"
            bg="brand.200"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <RiHome2Fill size={20} />
          </Flex>
        )}
        <Box>
          <Text fontWeight={700} textStyle="md">
            {highlightMatches(abrigo.nome, nomeMatch?.indices)}
          </Text>
          <Text textStyle="xs">
            Desabrigados: {abrigo.total_desabrigados} pessoas
          </Text>
        </Box>
      </Flex>
      <Stack gap={1}>
        <Text textStyle="sm">{abrigo.endereco}</Text>
        {abrigo.contato && (
          <Text textStyle="sm">
            <strong>Contato:</strong> {abrigo.contato}
          </Text>
        )}
        <Button asChild size="sm" mt={2} alignSelf="end">
          <Link href={`/eventos/${params.eventoSlug}/abrigos/${abrigo.id}`}>
            Ver detalhes
          </Link>
        </Button>
      </Stack>
    </Box>
  );
}
