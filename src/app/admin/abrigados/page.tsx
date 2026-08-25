import { Metadata } from "next";

import AbrigadosTable from "@/components/admin/AbrigadosTable";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Abrigados",
  description: "Pessoas acolhidas nos abrigos",
};

export default async function AdminAbrigadosPage() {
  const supabase = await createClient();

  const [{ data: abrigados }, { data: abrigos }] = await Promise.all([
    supabase.from("abrigados").select("*").order("nome"),
    supabase.from("abrigos").select("id, nome").order("nome"),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Abrigados"
        subtitle="Pessoas acolhidas nos abrigos"
      />
      <AbrigadosTable
        initialAbrigados={abrigados ?? []}
        abrigos={abrigos ?? []}
      />
    </div>
  );
}
