"use client";

import { useMemo, useState } from "react";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import Fuse from "fuse.js";

import AbrigoCard from "@/components/abrigos/AbrigoCard";
import SearchInput from "@/components/ui/SearchInput";
import { Tables } from "@/types/database";

type AbrigosListProps = {
  abrigos: Tables<"abrigos_com_contagem">[];
};

export default function AbrigosList({
  abrigos: initialAbrigos,
}: AbrigosListProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(initialAbrigos, {
      keys: ["nome"],
      ignoreDiacritics: true,
      includeMatches: true,
      includeScore: true,
      threshold: 0.3,
    });
  }, [initialAbrigos]);

  const results = fuse.search(query);
  const displayItems = query ? results.map((res) => res.item) : initialAbrigos;

  const matchResults = results.map((result) => result.matches);
  const matches =
    Array.isArray(matchResults) && matchResults.length > 0
      ? matchResults[0]
      : null;

  return (
    <Container>
      <Heading as="h1" size="xl" py={6}>
        Abrigos
      </Heading>

      <Box pb={6}>
        <SearchInput
          placeholder="Buscar abrigo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <VStack gap={3} mt={4} align="stretch">
          {displayItems.length === 0 ? (
            <Text p={8} textAlign="center">
              Nenhum abrigo encontrado.
            </Text>
          ) : (
            displayItems.map((abrigo) => (
              <AbrigoCard key={abrigo.id} abrigo={abrigo} matches={matches} />
            ))
          )}
        </VStack>
      </Box>
    </Container>
  );
}
