"use client";

import NextLink from "next/link";

import {
  Box,
  Container,
  Heading,
  Link as ChakraLink,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

export const DeletarDadosContent = () => {
  return (
    <Container maxW="2xl" py={6} pb={10}>
      <Box mb={6}>
        <Text>
          Você pode solicitar a exclusão dos seus dados pessoais cadastrados no
          SOS Brasil a qualquer momento.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          Como solicitar
        </Heading>
        <List.Root gap={2}>
          <ListItem>
            1. Envie um e-mail para <strong>contato@sosbrasil.leocs.me</strong>{" "}
            com o assunto: <strong>Solicitação de exclusão de dados.</strong>
          </ListItem>
          <ListItem>
            2. Informe o e-mail usado no cadastro, nome completo e, se possível,
            a data de criação da conta.
          </ListItem>
          <ListItem>
            3. A equipe do SOS Brasil avaliará o pedido e dará retorno no menor
            prazo possível.
          </ListItem>
        </List.Root>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          O que será removido
        </Heading>
        <Text>
          Em geral, removemos os dados pessoais do cadastro, como nome, e-mail,
          telefone e informações de perfil, quando não houver uma obrigação
          legal para mantê-los.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          Mantemos apenas o necessário
        </Heading>
        <Text>
          Podem ser mantidos registros mínimos exigidos por lei, por segurança
          da operação ou para cumprir obrigações regulatórias.
        </Text>
      </Box>

      <Box>
        <Text>
          Para mais informações, consulte nossa{" "}
          <ChakraLink
            as={NextLink}
            href="/politica-de-privacidade"
            color="brand.700"
          >
            Política de privacidade
          </ChakraLink>
          .
        </Text>
      </Box>
    </Container>
  );
};
