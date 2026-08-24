import { Grid, Heading, Stack, Text } from "@chakra-ui/react";
import {
  RiFlashlightFill,
  RiGroupFill,
  RiHandHeartFill,
  RiHomeHeartFill,
  RiNewspaperFill,
  RiRoadMapFill,
  RiUser3Fill,
} from "react-icons/ri";

import { StatCard, AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: eventos },
    { count: abrigos },
    { count: abrigados },
    { count: locais },
    { count: vias },
    { count: noticias },
    { count: usuarios },
  ] = await Promise.all([
    supabase.from("eventos").select("*", { count: "exact", head: true }),
    supabase.from("abrigos").select("*", { count: "exact", head: true }),
    supabase.from("abrigados").select("*", { count: "exact", head: true }),
    supabase.from("locais_doacao").select("*", { count: "exact", head: true }),
    supabase
      .from("vias_interditadas")
      .select("*", { count: "exact", head: true })
      .eq("ativa", true),
    supabase.from("noticias").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Eventos", value: eventos ?? 0, icon: <RiFlashlightFill /> },
    { label: "Abrigos", value: abrigos ?? 0, icon: <RiHomeHeartFill /> },
    { label: "Abrigados", value: abrigados ?? 0, icon: <RiGroupFill /> },
    {
      label: "Locais de doação",
      value: locais ?? 0,
      icon: <RiHandHeartFill />,
    },
    { label: "Vias interditadas", value: vias ?? 0, icon: <RiRoadMapFill /> },
    { label: "Notícias", value: noticias ?? 0, icon: <RiNewspaperFill /> },
    { label: "Usuários", value: usuarios ?? 0, icon: <RiUser3Fill /> },
  ];

  return (
    <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema SOS Brasil"
      />

      <Grid templateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap={4}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </Grid>

      <Stack
        py={5}
        px={6}
        mt="auto"
        rounded="lg"
        bg="bg.panel"
        border="1px solid"
        borderColor="border.emphasized"
        gap={4}
      >
        <Heading textStyle="md">Acesso rápido</Heading>
        <Text textStyle="sm" color="fg.muted">
          Use a barra lateral para navegar entre as seções. Cada seção permite
          criar, editar e excluir registros. Alterações são salvas imediatamente
          no Supabase.
        </Text>
      </Stack>
    </div>
  );
}
