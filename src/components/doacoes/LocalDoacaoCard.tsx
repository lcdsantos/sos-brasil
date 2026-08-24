import { Flex, Image, Stack, Text } from "@chakra-ui/react";
import { FuseResultMatch } from "fuse.js";
import { RiBuildingFill } from "react-icons/ri";

import { highlightMatches } from "@/components/ui/SearchHighlight";
import type { Tables } from "@/types/database";

type LocalDoacaoCardProps = {
  local: Tables<"locais_doacao">;
  action?: React.ReactNode;
  matches?: ReadonlyArray<FuseResultMatch> | null;
};

export default function LocalDoacaoCard({
  local,
  action,
  matches,
}: LocalDoacaoCardProps) {
  const nomeMatch = matches?.find((m) => m?.key === "nome");

  return (
    <Flex
      border="1px solid"
      borderColor="brand.200"
      borderRadius="14px"
      p={4}
      gap={3}
      align="flex-start"
    >
      {local.foto_url ? (
        <Image
          src={local.foto_url}
          alt={local.nome ?? "Local de Doação"}
          w="14"
          h="14"
          objectFit="cover"
          borderRadius="lg"
          flexShrink={0}
        />
      ) : (
        <Flex
          w="14"
          h="14"
          borderRadius="lg"
          bg="brand.100"
          align="center"
          justify="center"
          color="brand.600"
          flexShrink={0}
        >
          <RiBuildingFill size={24} />
        </Flex>
      )}

      <Stack gap={1} flex={1} minW={0}>
        <Text textStyle="sm">
          <strong>{highlightMatches(local.nome, nomeMatch?.indices)}</strong>
        </Text>
        <Text textStyle="sm" color="brand.700">
          <strong>Endereço:</strong> {local.endereco}
        </Text>
        {local.contato && (
          <Text textStyle="sm">
            <strong>Contato:</strong> {local.contato}
          </Text>
        )}
      </Stack>

      {action}
    </Flex>
  );
}
