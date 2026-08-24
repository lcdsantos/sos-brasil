import { Alert } from "@chakra-ui/react";
import { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/ui";
import UsuariosTable from "@/components/admin/UsuariosTable";
import { getProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Usuários",
  description: "Gerencie perfis e permissões de acesso",
};

export default async function AdminUsuariosPage() {
  const supabase = await createClient();
  const profile = await getProfile();

  if (profile?.role !== "admin") {
    return (
      <Alert.Root status="warning">
        <Alert.Indicator />
        <Alert.Title>
          Você não tem permissão para acessar esta página.
        </Alert.Title>
      </Alert.Root>
    );
  }

  const { data: usuarios } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminPageHeader
        title="Usuários"
        subtitle="Gerencie perfis e permissões de acesso"
      />
      <UsuariosTable initialUsuarios={usuarios ?? []} />
    </div>
  );
}
