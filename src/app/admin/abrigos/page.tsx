import { Metadata } from "next";

import AbrigosTable from "@/components/admin/AbrigosTable";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Abrigos",
  description: "Locais de acolhimento por evento",
};

export default async function AdminAbrigosPage() {
  const supabase = await createClient();

  const [{ data: abrigos }, { data: eventos }] = await Promise.all([
    supabase.from("abrigos_com_contagem").select("*").order("nome"),
    supabase.from("eventos").select("id, nome").order("nome"),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Abrigos"
        subtitle="Locais de acolhimento por evento"
      />
      <AbrigosTable initialAbrigos={abrigos ?? []} eventos={eventos ?? []} />
    </div>
  );
}
