"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Badge,
  BadgeProps,
  Button,
  Dialog,
  HStack,
  useDialog,
} from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { ItensUrgentesForm } from "@/components/admin/ItensUrgentesForm";
import {
  ActionsColumn,
  Btn,
  Column,
  DataTable,
  EventoSelect,
  Modal,
  SearchBar,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/client";
import { Tables, Enums } from "@/types/database";

type DoacaoItemUrgente = Tables<"doacao_itens_urgentes">;
type PrioridadesEnum = Enums<"prioridade_enum">;

const BLANK: DoacaoItemUrgente = {
  created_at: "",
  created_by: null,
  evento_id: "",
  id: "",
  item: "",
  prioridade: "alta",
  updated_at: "",
};

const PRIORIDADES_BADGES: Record<
  PrioridadesEnum,
  { label: string } & BadgeProps
> = {
  alta: { label: "Alta", colorPalette: "red" },
  media: { label: "Media", colorPalette: "yellow" },
  baixa: { label: "Baixa", colorPalette: "green" },
};

export default function ItensUrgentesAdminTable({
  initialItens,
  eventos,
}: {
  initialItens: DoacaoItemUrgente[];
  eventos: { id: string; nome: string }[];
}) {
  const [itens, setItens] = useState(initialItens);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Partial<DoacaoItemUrgente>>(BLANK);
  const [search, setSearch] = useState("");
  const [eventoFil, setEventoFil] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const dialog = useDialog();
  const supabase = createClient();

  const eventoNome = (id: string) =>
    eventos.find((e) => e.id === id)?.nome ?? "—";

  const filteredItens = itens.filter(
    (i) =>
      (eventoFil ? i.evento_id === eventoFil : true) &&
      i.item.toLowerCase().includes(search.toLowerCase()),
  );

  const saveItem = async () => {
    setSaving(true);

    const payload = {
      item: editing.item!,
      prioridade: editing.prioridade!,
      evento_id: editing.evento_id!,
    };

    if (mode === "create") {
      const { data } = await supabase
        .from("doacao_itens_urgentes")
        .insert(payload)
        .select()
        .single();
      if (data) setItens((prev) => [data, ...prev]);
    } else if (editing.id) {
      const { data } = await supabase
        .from("doacao_itens_urgentes")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (data)
        setItens((prev) => prev.map((i) => (i.id === data.id ? data : i)));
    }

    setSaving(false);
    router.refresh();
    dialog.setOpen(false);
  };

  const excluir = async (id: string, nome: string) => {
    if (!confirm(`Excluir "${nome}"?`)) return;
    await supabase.from("doacao_itens_urgentes").delete().eq("id", id);
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const colsItens: Column<DoacaoItemUrgente>[] = [
    { key: "item", header: "Item", render: (r) => <strong>{r.item}</strong> },
    {
      key: "evento_id",
      header: "Evento",
      width: 200,
      render: (r) => eventoNome(r.evento_id),
    },
    {
      key: "prioridade",
      header: "Prioridade",
      width: 110,
      render: (r) => {
        const prioridade = PRIORIDADES_BADGES[r.prioridade];
        return (
          <Badge colorPalette={prioridade.colorPalette}>
            {prioridade.label}
          </Badge>
        );
      },
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
          onRemoveClick={() => excluir(r.id, r.item)}
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
            placeholder="Buscar item..."
          />
        </HStack>
        <Btn
          onClick={() => {
            setEditing({
              evento_id: eventoFil || eventos[0]?.id,
            });
            setMode("create");
            dialog.setOpen(true);
          }}
        >
          <RiAddFill /> Novo item
        </Btn>
      </HStack>

      <DataTable columns={colsItens} rows={filteredItens} />

      <Modal
        title={mode === "create" ? "Novo item urgente" : "Editar item"}
        action={
          <Button type="submit" form="itens-urgentes-form" loading={saving}>
            {mode === "create" ? "Criar" : "Salvar"}
          </Button>
        }
      >
        <ItensUrgentesForm
          eventos={eventos}
          itens={editing}
          onSubmit={saveItem}
        />
      </Modal>
    </Dialog.RootProvider>
  );
}
