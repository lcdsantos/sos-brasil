import { notFound } from "next/navigation";

import { Metadata } from "next";

import AbrigosList from "@/components/abrigos/AbrigosList";
import { createClient } from "@/lib/supabase/server";

type AbrigosPageProps = {
  params: Promise<{ eventoSlug: string }>;
};

export const metadata: Metadata = {
  title: "Abrigos",
  description: "Abrigos cadastrados no evento",
};

export default async function AbrigosPage(props: AbrigosPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  const [{ data: abrigos }] = await Promise.all([
    supabase
      .from("abrigos_com_contagem")
      .select(`*, eventos!inner ( slug )`)
      .eq("eventos.slug", params.eventoSlug)
      .order("nome"),
  ]);

  if (!abrigos) return notFound();

  return <AbrigosList abrigos={abrigos} />;
}
