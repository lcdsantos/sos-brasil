import { notFound } from "next/navigation";

import { Metadata } from "next";

import { MapContainer } from "@/components/vias/MapContainer";
import { createClient } from "@/lib/supabase/server";

type ViasInterditadasPageProps = {
  params: Promise<{ eventoSlug: string }>;
};

export const metadata: Metadata = {
  title: "Vias Interditadas",
  description: "Vias interditadas no evento",
};

export default async function ViasInterditadasPage(
  props: ViasInterditadasPageProps,
) {
  const params = await props.params;
  const supabase = await createClient();

  const [{ data: vias }] = await Promise.all([
    supabase
      .from("vias_interditadas")
      .select("*, eventos!inner ( slug )")
      .eq("eventos.slug", params.eventoSlug)
      .eq("ativa", true)
      .order("created_at", { ascending: false }),
  ]);

  if (!vias) return notFound();

  const places = vias?.map((via) => ({
    id: via.google_maps_place_id,
    content: via.motivo,
  }));

  return <MapContainer places={places} />;
}
