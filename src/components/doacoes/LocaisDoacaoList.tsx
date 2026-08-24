"use client";

import { useMemo, useState } from "react";

import { Heading, Stack, Text, VStack } from "@chakra-ui/react";
import Fuse from "fuse.js";

import LocalDoacaoCard from "@/components/doacoes/LocalDoacaoCard";
import SearchInput from "@/components/ui/SearchInput";
import { Tables } from "@/types/database";

type LocaisDoacaoListProps = {
  locais: Tables<"locais_doacao">[];
};

export default function LocaisDoacaoList({
  locais: initialLocais,
}: LocaisDoacaoListProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(initialLocais, {
      keys: ["nome"],
      ignoreDiacritics: true,
      includeMatches: true,
      includeScore: true,
      threshold: 0.3,
    });
  }, [initialLocais]);

  const results = fuse.search(query);
  const displayItems = query ? results.map((res) => res.item) : initialLocais;

  const matchResults = results.map((result) => result.matches);
  const matches =
    Array.isArray(matchResults) && matchResults.length > 0
      ? matchResults[0]
      : null;

  return (
    <Stack pt={4} pb={10} gap={3}>
      <Heading as="h2" size="md">
        Locais de doação
      </Heading>

      <SearchInput
        placeholder="Buscar local de doação"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <VStack gap={2} mt={4} align="stretch">
        {displayItems.length === 0 ? (
          <Text p={8} textAlign="center">
            Nenhum local de doação encontrado.
          </Text>
        ) : (
          displayItems.map((local) => (
            <LocalDoacaoCard key={local.id} local={local} matches={matches} />
          ))
        )}
      </VStack>
    </Stack>
  );
}
