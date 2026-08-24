import { Metadata } from "next";

import NoticiasAdminTable from "@/components/admin/NoticiasAdminTable";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Feed de alertas e informações por evento",
};

export default async function AdminNoticiasPage() {
  const supabase = await createClient();

  const [{ data: noticias }, { data: eventos }] = await Promise.all([
    supabase
      .from("noticias")
      .select("*")
      .order("publicado_em", { ascending: false }),
    supabase.from("eventos").select("id, nome").order("nome"),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Notícias"
        subtitle="Feed de alertas e informações por evento"
      />
      <NoticiasAdminTable
        initialNoticias={noticias ?? []}
        eventos={eventos ?? []}
      />
    </div>
  );
}
