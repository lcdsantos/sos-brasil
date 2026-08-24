"use client";

import { PropsWithChildren } from "react";

import Link from "next/link";

import { Flex, Link as ChakraLink } from "@chakra-ui/react";

export default function MobileShell({ children }: PropsWithChildren) {
  return (
    <Flex
      direction="column"
      minH="100dvh"
      position="relative"
      bg="orange.900/5"
    >
      {children}

      <Flex as="footer" justify="center" py={4} px={4} gap={4} mt="auto">
        <ChakraLink
          as={Link}
          href="/politica-de-privacidade"
          fontSize="xs"
          textDecoration="underline"
          _hover={{ textDecoration: "none" }}
        >
          Política de privacidade
        </ChakraLink>

        <ChakraLink
          as={Link}
          href="/termos-de-uso"
          fontSize="xs"
          textDecoration="underline"
          _hover={{ textDecoration: "none" }}
        >
          Termos de uso
        </ChakraLink>
      </Flex>
    </Flex>
  );
}
