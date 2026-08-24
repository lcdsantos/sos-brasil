import { Metadata } from "next";

import DoacoesAdminTable from "@/components/admin/DoacoesAdminTable";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Doações",
  description: "Locais de coleta e itens urgentes por evento",
};

export default async function AdminDoacoesPage() {
  const supabase = await createClient();

  const [{ data: locais }, { data: itens }, { data: eventos }] =
    await Promise.all([
      supabase.from("locais_doacao").select("*").order("nome"),
      supabase
        .from("doacao_itens_urgentes")
        .select("*")
        .order("prioridade")
        .order("item"),
      supabase.from("eventos").select("id, nome").order("nome"),
    ]);

  return (
    <div>
      <AdminPageHeader
        title="Doações"
        subtitle="Locais de coleta e itens urgentes por evento"
      />
      <DoacoesAdminTable
        initialLocais={locais ?? []}
        initialItens={itens ?? []}
        eventos={eventos ?? []}
      />
    </div>
  );
}
