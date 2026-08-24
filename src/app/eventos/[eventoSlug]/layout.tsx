import { PropsWithChildren } from "react";

import { notFound } from "next/navigation";

import EventoBanner from "@/components/eventos/EventoBanner";
import MobileShell from "@/components/layout/MobileShell";
import { getEvento } from "@/lib/data";

type EventoDashboardPageProps = {
  params: Promise<{ eventoSlug: string }>;
};

export default async function Layout(
  props: PropsWithChildren<EventoDashboardPageProps>,
) {
  const params = await props.params;
  const evento = await getEvento({ eventoSlug: params.eventoSlug });

  if (!evento) return notFound();

  return (
    <MobileShell>
      <EventoBanner evento={evento} />
      {props.children}
    </MobileShell>
  );
}
