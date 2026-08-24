import {
  Container,
  Flex,
  Grid,
  Text,
  Icon,
  Image,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Metadata } from "next";
import {
  RiAlarmWarningFill,
  RiAlertFill,
  RiCheckboxCircleFill,
} from "react-icons/ri";

import EventoCard from "@/components/eventos/EventoCard";
import LoginButton from "@/components/layout/LoginButton";
import MobileShell from "@/components/layout/MobileShell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "SOS Brasil",
  description: "Plataforma de apoio em situações de emergência",
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: eventos } = await supabase
    .from("eventos")
    .select("*")
    .order("data_inicio", { ascending: false });

  const ativos = eventos?.filter((e) => e.status === "ativo") ?? [];
  const monitoramento =
    eventos?.filter((e) => e.status === "monitoramento") ?? [];
  const encerrados = eventos?.filter((e) => e.status === "encerrado") ?? [];

  return (
    <MobileShell>
      <Flex align="center" justify="space-between" px={5} py={4}>
        <Image w="36" src="/logo.svg" alt="SOS Brasil" />
        <LoginButton />
      </Flex>

      <VisuallyHidden as="h1">SOS Brasil</VisuallyHidden>

      <Container py={8}>
        {ativos.length > 0 && (
          <>
            <Text fontWeight={700} color="red.600" mb={3}>
              <Icon size="lg" mr={1} verticalAlign="top" aria-hidden="true">
                <RiAlarmWarningFill />
              </Icon>
              EMERGÊNCIAS ATIVAS
            </Text>
            <Grid gap={3} mb={5}>
              {ativos.map((e) => (
                <EventoCard key={e.id} evento={e} />
              ))}
            </Grid>
          </>
        )}

        {monitoramento.length > 0 && (
          <>
            <Text fontWeight={700} color="yellow.700" mb={3}>
              <Icon size="lg" mr={1} verticalAlign="top" aria-hidden="true">
                <RiAlertFill />
              </Icon>
              EM MONITORAMENTO
            </Text>
            <Grid gap={3} mb={5}>
              {monitoramento.map((e) => (
                <EventoCard key={e.id} evento={e} />
              ))}
            </Grid>
          </>
        )}

        {encerrados.length > 0 && (
          <>
            <Text fontWeight={700} color="brand.700" mb={3}>
              <Icon size="lg" mr={1} verticalAlign="top" aria-hidden="true">
                <RiCheckboxCircleFill />
              </Icon>
              ENCERRADOS
            </Text>
            <Grid gap={3}>
              {encerrados.map((e) => (
                <EventoCard key={e.id} evento={e} />
              ))}
            </Grid>
          </>
        )}

        {!eventos?.length && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="60vh"
            gap={3}
          >
            <Text fontSize="40px">🙏</Text>
            <Text fontWeight={700} color="brand.700">
              Nenhuma evento ativo
            </Text>
            <Text fontSize="13px" color="brand.400" textAlign="center">
              Quando um evento for cadastrado, ele aparecerá aqui.
            </Text>
          </Flex>
        )}
      </Container>
    </MobileShell>
  );
}
