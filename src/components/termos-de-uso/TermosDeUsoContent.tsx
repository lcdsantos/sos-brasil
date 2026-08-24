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

export const TermosDeUsoContent = () => {
  return (
    <Container maxW="2xl" py={6} pb={10}>
      <Box mb={6}>
        <Text>
          Ao utilizar o SOS Brasil, você concorda com estes Termos de Uso. Este
          documento define as regras para acesso, utilização e responsabilidade
          da plataforma e dos serviços disponibilizados.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          1. Aceitação dos termos
        </Heading>
        <Text>
          Ao criar uma conta, acessar ou utilizar a plataforma, você reconhece
          que leu, compreendeu e aceita estas condições, bem como a nossa
          Política de Privacidade.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          2. Objetivo da plataforma
        </Heading>
        <Text>
          O SOS Brasil tem por finalidade apoiar a organização de informações
          relacionadas a eventos, abrigos, doações e ações de apoio em situações
          de emergência, com foco em acesso e mobilização de recursos.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          3. Uso adequado
        </Heading>
        <List.Root gap={2}>
          <ListItem>
            Usar a plataforma apenas para fins legítimos e autorizados.
          </ListItem>
          <ListItem>
            Não divulgar informações falsas, ameaçadoras ou prejudiciais.
          </ListItem>
          <ListItem>
            Não praticar ações que comprometam a segurança, estabilidade ou
            funcionamento da plataforma.
          </ListItem>
          <ListItem>
            Respeitar a privacidade e os direitos de outros usuários.
          </ListItem>
        </List.Root>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          4. Cadastro e conta
        </Heading>
        <Text>
          O usuário é responsável por manter seus dados de cadastro verdadeiros,
          completos e atualizados. É de sua responsabilidade manter a
          confidencialidade de suas credenciais de acesso.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          5. Conteúdo e informações
        </Heading>
        <Text>
          O SOS Brasil pode disponibilizar conteúdos, dados e informações de
          terceiros, organizadores, instituições e usuários. A publicação de
          informações é responsabilidade de quem as envia e a plataforma atua
          como meio de veiculação e organização dessas informações.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          6. Responsabilidade
        </Heading>
        <Text>
          A plataforma se esforça para manter o serviço disponível e funcional,
          mas não garante ausência de interrupções, falhas técnicas ou erros em
          dados fornecidos por terceiros ou por usuários.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          7. Exclusão e encerramento de acesso
        </Heading>
        <Text>
          O SOS Brasil pode, a seu critério, suspender ou encerrar o acesso de
          qualquer usuário quando houver violação destes termos, uso indevido da
          plataforma ou risco à segurança, integridade ou reputação do serviço.
        </Text>
      </Box>

      <Box mb={6}>
        <Heading as="h2" size="md" mb={3}>
          8. Alterações nos termos
        </Heading>
        <Text>
          Estes Termos de Uso podem ser atualizados periodicamente para refletir
          melhorias, mudanças legais ou ajustes na operação da plataforma. A
          versão mais recente será disponibilizada dentro da aplicação.
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
