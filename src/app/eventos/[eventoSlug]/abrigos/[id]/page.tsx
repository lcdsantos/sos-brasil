import { notFound } from "next/navigation";

import {
  Box,
  Container,
  Flex,
  Heading,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import {
  RiAlertFill,
  RiGroupFill,
  RiMapPin2Fill,
  RiPhoneFill,
} from "react-icons/ri";

import PageHeader from "@/components/layout/PageHeader";
import { createClient } from "@/lib/supabase/server";

type AbrigoDetalhePageProps = {
  params: Promise<{ eventoSlug: string; id: string }>;
};

export const metadata: Metadata = {
  title: "Abrigo",
  description: "Detalhes do abrigo",
};

export default async function AbrigoDetalhePage(props: AbrigoDetalhePageProps) {
  const params = await props.params;
  const supabase = await createClient();

  const [{ data: abrigo }, { data: abrigados }, { data: itens }] =
    await Promise.all([
      supabase
        .from("abrigos_com_contagem")
        .select("*")
        .eq("id", params.id)
        .single(),
      supabase
        .from("abrigados")
        .select("*")
        .eq("abrigo_id", params.id)
        .order("nome"),
      supabase
        .from("abrigo_itens_urgentes")
        .select("*")
        .eq("abrigo_id", params.id),
    ]);

  if (!abrigo) return notFound();

  const INFO = [
    {
      icon: <RiMapPin2Fill size={32} />,
      label: "Endereço",
      value: abrigo.endereco,
    },
    {
      icon: <RiPhoneFill size={32} />,
      label: "Telefone",
      value: abrigo.contato,
    },
    {
      icon: <RiGroupFill size={32} />,
      label: "Desabrigados",
      value: `${abrigo.total_desabrigados} pessoas`,
    },
    {
      icon: <RiAlertFill size={32} />,
      label: "Itens urgentes",
      value: itens?.map((i) => i.item).join(", "),
    },
  ];

  return (
    <Container>
      <PageHeader title={abrigo.nome} />

      <Box px={4} pb={8}>
        <Stack gap={4}>
          {INFO.map(
            ({ icon, label, value }) =>
              value && (
                <Flex key={label} gap={4} align="flex-start">
                  {icon}
                  <Box>
                    <Text textStyle="sm">{label}</Text>
                    <Text textStyle="md">{value}</Text>
                  </Box>
                </Flex>
              ),
          )}
        </Stack>

        <Separator borderColor="brand.200" my={4} />

        <Heading as="h2" size="md" mb={3}>
          Abrigados
        </Heading>

        <VStack gap={0} align="stretch">
          {abrigados?.map((p, i) => (
            <Box key={p.id}>
              {i > 0 && <Separator borderColor="brand.100" />}
              <Box py={2}>
                <Text fontWeight={500} textStyle="md">
                  {p.nome}
                </Text>
                {p.idade && (
                  <Text color="brand.500" textStyle="sm">
                    {p.idade} anos
                  </Text>
                )}
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>
    </Container>
  );
}
