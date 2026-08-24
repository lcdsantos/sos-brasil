"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Badge, Button, Dialog, HStack, useDialog } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { NoticiasForm } from "@/components/admin/NoticiasForm";
import { createClient } from "@/lib/supabase/client";
import type { Tables, Enums } from "@/types/database";

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

type Noticia = Tables<"noticias">;
type NoticiaTagEnum = Enums<"noticia_tag_enum">;

const TAGS: Record<NoticiaTagEnum, { label: string }> = {
  alerta: { label: "🔴 Alerta" },
  informativo: { label: "ℹ️ Informativo" },
  boas_noticias: { label: "✅ Boas notícias" },
  transito: { label: "🚗 Trânsito" },
  previsao_tempo: { label: "🌦 Previsão do tempo" },
};

export default function NoticiasAdminTable({
  initialNoticias,
  eventos,
}: {
  initialNoticias: Noticia[];
  eventos: { id: string; nome: string }[];
}) {
  const [noticias, setNoticias] = useState(initialNoticias);
  const [search, setSearch] = useState("");
  const [eventoFil, setEventoFil] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Partial<Noticia>>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const confirm = useConfirm();
  const dialog = useDialog();

  const filtered = noticias.filter(
    (n) =>
      (eventoFil ? n.evento_id === eventoFil : true) &&
      (n.titulo.toLowerCase().includes(search.toLowerCase()) ||
        n.texto.toLowerCase().includes(search.toLowerCase())),
  );

  const eventoNome = (id: string) =>
    eventos.find((e) => e.id === id)?.nome ?? "—";

  const handleOnSubmit = async (data: Partial<Noticia>) => {
    setSaving(true);

    const payload = {
      titulo: data.titulo!,
      texto: data.texto!,
      tag: data.tag!,
      fonte: data.fonte || null,
      publicado_em: data.publicado_em || new Date().toISOString(),
      evento_id: data.evento_id!,
    };

    if (mode === "create") {
      const { data, error } = await supabase
        .from("noticias")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        setNoticias((prev) => [data, ...prev]);
      }
    } else if (editing.id) {
      const { data, error } = await supabase
        .from("noticias")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();

      if (!error && data) {
        setNoticias((prev) => prev.map((n) => (n.id === data.id ? data : n)));
      }
    }

    setSaving(false);
    router.refresh();
    dialog.setOpen(false);
  };

  const excluir = async (id: string, titulo: string) => {
    if (!confirm(`Excluir "${titulo}"?`)) return;
    await supabase.from("noticias").delete().eq("id", id);
    setNoticias((prev) => prev.filter((n) => n.id !== id));
  };

  const cols: Column<Noticia>[] = [
    {
      key: "titulo",
      header: "Título",
      render: (r) => <strong>{r.titulo}</strong>,
    },
    {
      key: "evento_id",
      header: "Evento",
      width: 160,
      render: (r) => eventoNome(r.evento_id),
    },
    {
      key: "tag",
      header: "Categoria",
      width: 130,
      render: (r) => <Badge colorPalette="gray">{TAGS[r.tag].label}</Badge>,
    },
    { key: "fonte", header: "Fonte", width: 130 },
    {
      key: "publicado_em",
      header: "Publicado",
      width: 120,
      render: (r) =>
        new Date(r.publicado_em).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
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
          onRemoveClick={() => excluir(r.id, r.titulo)}
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
            placeholder="Buscar notícia..."
          />
        </HStack>
        <Btn
          onClick={() => {
            setEditing({
              evento_id: eventoFil || eventos[0]?.id,
              tag: "informativo",
              publicado_em: new Date().toISOString().slice(0, 16),
            });
            setMode("create");
            dialog.setOpen(true);
          }}
        >
          <RiAddFill /> Nova notícia
        </Btn>
      </HStack>

      <DataTable columns={cols} rows={filtered} />

      <Modal
        title={mode === "create" ? "Nova noticia" : "Editar noticia"}
        action={
          <Button type="submit" form="noticia-form" loading={saving}>
            {mode === "create" ? "Criar" : "Salvar"}
          </Button>
        }
      >
        <NoticiasForm
          eventos={eventos}
          noticia={editing}
          onSubmit={handleOnSubmit}
        />
      </Modal>
    </Dialog.RootProvider>
  );
}
