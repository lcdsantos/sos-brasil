import { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/ui";
import ViasAdminTable from "@/components/admin/ViasAdminTable";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Vias Interditadas",
  description: "Bloqueios e interdições por evento",
};

export default async function AdminViasPage() {
  const supabase = await createClient();

  const [{ data: vias }, { data: eventos }] = await Promise.all([
    supabase
      .from("vias_interditadas")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("eventos").select("id, nome").order("nome"),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Vias Interditadas"
        subtitle="Bloqueios e interdições por evento"
      />
      <ViasAdminTable initialVias={vias ?? []} eventos={eventos ?? []} />
    </div>
  );
}
