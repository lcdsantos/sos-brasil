"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, Dialog, HStack, useDialog } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { AbrigosForm } from "@/components/admin/AbrigosForm";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

import {
  DataTable,
  Column,
  Btn,
  SearchBar,
  EventoSelect,
  useConfirm,
  Modal,
  ActionsColumn,
} from "./ui";

type AbrigoComContagem = Tables<"abrigos_com_contagem">;

const BLANK: AbrigoComContagem = {
  contato: null,
  created_at: null,
  created_by: null,
  endereco: null,
  evento_id: null,
  foto_url: null,
  id: null,
  nome: null,
  total_desabrigados: null,
  updated_at: null,
};

export default function AbrigosTable({
  initialAbrigos,
  eventos,
}: {
  initialAbrigos: AbrigoComContagem[];
  eventos: { id: string; nome: string }[];
}) {
  const [abrigos, setAbrigos] = useState(initialAbrigos);
  const [search, setSearch] = useState("");
  const [eventoFil, setEventoFil] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Partial<AbrigoComContagem>>(BLANK);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const confirm = useConfirm();
  const dialog = useDialog();

  const filtered = abrigos.filter(
    (a) =>
      (eventoFil ? a.evento_id === eventoFil : true) &&
      (a.nome?.toLowerCase().includes(search.toLowerCase()) ||
        a.endereco?.toLowerCase().includes(search.toLowerCase())),
  );

  const openCreate = () => {
    setMode("create");
    setEditing({ ...BLANK, evento_id: eventoFil || eventos[0]?.id });
    dialog.setOpen(true);
  };

  const handleOnSubmit = async (data: Partial<AbrigoComContagem>) => {
    setSaving(true);

    const payload = {
      nome: data.nome!,
      endereco: data.endereco!,
      contato: data.contato || null,
      evento_id: data.evento_id!,
      foto_url: data.foto_url || "",
    };

    if (mode === "create") {
      const { data, error } = await supabase
        .from("abrigos")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        setAbrigos((prev) => [{ ...data, total_desabrigados: 0 }, ...prev]);
      }
    } else if (editing.id) {
      const { data, error } = await supabase
        .from("abrigos")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();

      if (!error && data) {
        setAbrigos((prev) =>
          prev.map((a) =>
            a.id === data.id
              ? { ...data, total_desabrigados: a.total_desabrigados }
              : a,
          ),
        );
      }
    }

    setSaving(false);
    router.refresh();
    dialog.setOpen(false);
  };

  const excluir = async (id: string | null, nome: string | null) => {
    if (!id || !nome) return;
    if (!confirm(`Excluir "${nome}" e todos os abrigados vinculados?`)) return;
    await supabase.from("abrigos").delete().eq("id", id);
    setAbrigos((prev) => prev.filter((a) => a.id !== id));
    router.refresh();
  };

  const eventoNome = (id: string | null) =>
    eventos.find((e) => e.id === id)?.nome ?? "—";

  const cols: Column<AbrigoComContagem>[] = [
    { key: "nome", header: "Nome", render: (r) => <strong>{r.nome}</strong> },
    {
      key: "evento_id",
      header: "Evento",
      width: 200,
      render: (r) => eventoNome(r.evento_id),
    },
    { key: "endereco", header: "Endereço", width: 220 },
    { key: "contato", header: "Contato", width: 130 },
    {
      key: "total_desabrigados",
      header: "Desabrigados",
      width: 110,
      render: (r) => <strong>{r.total_desabrigados}</strong>,
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
          onRemoveClick={() => excluir(r.id, r.nome)}
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
            placeholder="Buscar abrigo..."
          />
        </HStack>
        <Btn onClick={openCreate}>
          <RiAddFill /> Novo abrigo
        </Btn>
      </HStack>

      <DataTable columns={cols} rows={filtered} />

      <Modal
        title={mode === "create" ? "Novo abrigo" : "Editar abrigo"}
        action={
          <Button type="submit" form="abrigos-form" loading={saving}>
            {mode === "create" ? "Criar" : "Salvar"}
          </Button>
        }
      >
        <AbrigosForm
          eventos={eventos}
          abrigo={editing}
          onSubmit={handleOnSubmit}
        />
      </Modal>
    </Dialog.RootProvider>
  );
}
