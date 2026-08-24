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

export const PoliticaPrivacidadeContent = () => {
  return (
    <Container maxW="2xl" py={6} pb={10}>
      <Box mb={6}>
        <Text>
          A plataforma SOS Brasil respeita sua privacidade e trata os dados de
          forma responsável, com foco na segurança, transparência e uso mínimo
          necessário para oferecer os serviços da aplicação.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          1. Dados coletados
        </Heading>
        <Text>
          Coletamos dados que você fornece diretamente ao usar a plataforma,
          como nome, e-mail, telefone, endereço e informações necessárias para
          cadastro, autenticação e acesso aos serviços disponibilizados.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          2. Finalidade do uso
        </Heading>
        <List.Root gap={2}>
          <ListItem>Permitir o cadastro e autenticação do usuário.</ListItem>
          <ListItem>
            Facilitar a busca e a comunicação de informações úteis.
          </ListItem>
          <ListItem>Organizar a gestão de eventos, abrigos e doações.</ListItem>
          <ListItem>
            Melhorar a experiência e a operação da plataforma.
          </ListItem>
        </List.Root>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          3. Compartilhamento de dados
        </Heading>
        <Text>
          Os dados podem ser compartilhados apenas com prestadores de serviço
          essenciais para a operação da plataforma, como infraestrutura,
          autenticação e apoio técnico, e somente conforme necessário para a
          prestação do serviço ou quando exigido por lei.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          4. Segurança
        </Heading>
        <Text>
          Adotamos medidas razoáveis de segurança para proteger seus dados
          contra acesso não autorizado, uso indevido, alteração ou destruição.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          5. Retenção
        </Heading>
        <Text>
          Mantemos os dados apenas pelo período necessário para cumprir as
          finalidades da plataforma, respeitando obrigações legais e
          regulatórias.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          6. Seus direitos
        </Heading>
        <Text>
          Você pode solicitar acesso, correção, exclusão ou atualização de suas
          informações, bem como informações sobre o tratamento dos seus dados,
          entrando em contato com a equipe responsável pela plataforma.
        </Text>
        <Text mt={3}>
          Para instruções detalhadas sobre como excluir seus dados pessoais,
          acesse{" "}
          <ChakraLink as={NextLink} href="/deletar-dados" color="brand.700">
            essa página
          </ChakraLink>
          .
        </Text>
      </Box>

      <Box>
        <Heading as="h2" size="md" mb={3}>
          7. Alterações
        </Heading>
        <Text>
          Esta política pode ser atualizada periodicamente para refletir
          mudanças na operação, na legislação ou nas práticas de segurança. A
          versão mais recente será sempre disponibilizada dentro da aplicação.
        </Text>
      </Box>
    </Container>
  );
};
