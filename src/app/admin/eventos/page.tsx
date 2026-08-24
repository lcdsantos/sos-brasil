import { Metadata } from "next";

import EventosTable from "@/components/admin/EventosTable";
import { AdminPageHeader } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Gerencie tragédias e situações de emergência",
};

export default async function AdminEventosPage() {
  const supabase = await createClient();

  const { data: eventos } = await supabase
    .from("eventos")
    .select("*")
    .order("data_inicio", { ascending: false });

  return (
    <div>
      <AdminPageHeader
        title="Eventos"
        subtitle="Gerencie tragédias e situações de emergência"
      />
      <EventosTable initialEventos={eventos ?? []} />
    </div>
  );
}
