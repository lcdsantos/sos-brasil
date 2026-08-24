"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Badge, Button, Dialog, HStack, useDialog } from "@chakra-ui/react";
import { setOptions } from "@googlemaps/js-api-loader";
import { RiAddFill } from "react-icons/ri";

import { ViaFormData, ViasForm } from "@/components/admin/ViasForm";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

import {
  DataTable,
  Column,
  Btn,
  Modal,
  SearchBar,
  EventoSelect,
  useConfirm,
  ActionsColumn,
} from "./ui";

type ViaInterditada = Tables<"vias_interditadas">;

export default function ViasAdminTable({
  initialVias,
  eventos,
}: {
  initialVias: ViaInterditada[];
  eventos: { id: string; nome: string }[];
}) {
  const [vias, setVias] = useState(initialVias);
  const [search, setSearch] = useState("");
  const [eventoFil, setEventoFil] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Partial<ViaInterditada>>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const confirm = useConfirm();
  const dialog = useDialog();
  const setOptionsRef = useRef(false);

  useEffect(() => {
    if (!setOptionsRef.current) {
      setOptionsRef.current = true;
      setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY });
    }
  }, []);

  const filtered = vias.filter(
    (v) =>
      (eventoFil ? v.evento_id === eventoFil : true) &&
      v.endereco.toLowerCase().includes(search.toLowerCase()),
  );

  const eventoNome = (id: string) =>
    eventos.find((e) => e.id === id)?.nome ?? "—";

  const handleOnSubmit = async (data: ViaFormData) => {
    setSaving(true);

    const payload = {
      endereco: data.endereco!,
      motivo: data.motivo || null,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      ativa: data.ativa ?? true,
      evento_id: data.evento_id!,
      google_maps_place_id: data.google_maps_place_id,
    };

    if (mode === "create") {
      const { data } = await supabase
        .from("vias_interditadas")
        .insert(payload)
        .select()
        .single();

      if (data) setVias((prev) => [data, ...prev]);
    } else if (editing.id) {
      const { data } = await supabase
        .from("vias_interditadas")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (data)
        setVias((prev) => prev.map((v) => (v.id === data.id ? data : v)));
    }

    setSaving(false);
    router.refresh();
    dialog.setOpen(false);
  };

  const excluir = async (id: string, end: string) => {
    if (!confirm(`Excluir via "${end}"?`)) return;
    await supabase.from("vias_interditadas").delete().eq("id", id);
    setVias((prev) => prev.filter((v) => v.id !== id));
  };

  const cols: Column<ViaInterditada>[] = [
    {
      key: "endereco",
      header: "Endereço",
      render: (r) => <strong>{r.endereco}</strong>,
    },
    {
      key: "evento_id",
      header: "Evento",
      width: 180,
      render: (r) => eventoNome(r.evento_id),
    },
    { key: "motivo", header: "Motivo", width: 180 },
    {
      key: "ativa",
      header: "Status",
      width: 90,
      render: (r) => (
        <Badge colorPalette={r.ativa ? "red" : "green"}>
          {r.ativa ? "Ativa" : "Inativa"}
        </Badge>
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      width: 0,
      textAlign: "end",
      render: (r) => (
        <ActionsColumn
          onEditClick={() => {
            setEditing(r);
            setMode("edit");
            dialog.setOpen(true);
          }}
          onRemoveClick={() => excluir(r.id, r.endereco)}
        />
      ),
    },
  ];

  return (
    <Dialog.RootProvider value={dialog}>
      <HStack justify="space-between" gap={4} mb={4}>
        <HStack align="center" gap={2}>
          <EventoSelect
            eventos={eventos}
            value={eventoFil}
            onChange={setEventoFil}
          />
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar via..."
          />
        </HStack>
        <Btn
          onClick={() => {
            setEditing({ evento_id: eventoFil || eventos[0]?.id, ativa: true });
            setMode("create");
            dialog.setOpen(true);
          }}
        >
          <RiAddFill /> Nova via
        </Btn>
      </HStack>

      <DataTable columns={cols} rows={filtered} />

      <Modal
        title={mode === "create" ? "Nova via interditada" : "Editar via"}
        action={
          <Button type="submit" form="via-form" loading={saving}>
            {mode === "create" ? "Criar" : "Salvar"}
          </Button>
        }
      >
        <ViasForm eventos={eventos} via={editing} onSubmit={handleOnSubmit} />
      </Modal>
    </Dialog.RootProvider>
  );
}
