"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Badge,
  BadgeProps,
  Button,
  Code,
  Dialog,
  HStack,
  useDialog,
} from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { EventosForm } from "@/components/admin/EventosForm";
import { createClient } from "@/lib/supabase/client";
import type { Enums, Tables } from "@/types/database";

import {
  ActionsColumn,
  Btn,
  Column,
  DataTable,
  Modal,
  SearchBar,
  useConfirm,
} from "./ui";

type Evento = Tables<"eventos">;
type EventoTipoEnum = Enums<"evento_tipo_enum">;
type EventoStatusEnum = Enums<"evento_status_enum">;

const BLANK: Evento = {
  nome: "",
  slug: "",
  descricao: "",
  tipo: "outro",
  status: "ativo",
  localidade: "",
  estado: "RS",
  data_inicio: new Date().toISOString().slice(0, 10),
  created_at: "",
  criado_por: null,
  data_fim: null,
  id: "",
  latitude: null,
  longitude: null,
  updated_at: "",
};

const TIPOS: Record<EventoTipoEnum, { label: string }> = {
  enchente: { label: "🌊 Enchente" },
  ciclone: { label: "🌀 Ciclone" },
  incendio: { label: "🔥 Incêndio" },
  seca: { label: "☀️ Seca" },
  deslizamento: { label: "⛰️ Deslizamento" },
  terremoto: { label: "🏚️ Terremoto" },
  outro: { label: "⚠️ Outro" },
};

const STATUS_BADGES: Record<EventoStatusEnum, { label: string } & BadgeProps> =
  {
    ativo: { label: "Ativo", colorPalette: "red" },
    monitoramento: { label: "Monitoramento", colorPalette: "yellow" },
    encerrado: { label: "Encerrado", colorPalette: "green" },
  };

export default function EventosTable({
  initialEventos,
}: {
  initialEventos: Evento[];
}) {
  const [eventos, setEventos] = useState(initialEventos);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Partial<Evento>>(BLANK);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const confirm = useConfirm();
  const dialog = useDialog();

  const filtered = eventos.filter(
    (e) =>
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.localidade.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setMode("create");
    setEditing(BLANK);
    dialog.setOpen(true);
  };

  const handleOnSubmit = async (data: Partial<Evento>) => {
    setSaving(true);

    const payload = {
      nome: data.nome!,
      slug: data.slug!,
      descricao: data.descricao,
      tipo: data.tipo!,
      status: data.status!,
      localidade: data.localidade!,
      estado: data.estado!,
      data_inicio: data.data_inicio!,
    };

    if (mode === "create") {
      const { data, error } = await supabase
        .from("eventos")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        setEventos((prev) => [data, ...prev]);
      }
    } else if (editing.id) {
      const { data, error } = await supabase
        .from("eventos")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();

      if (!error && data) {
        setEventos((prev) => prev.map((e) => (e.id === data.id ? data : e)));
      }
    }

    setSaving(false);
    router.refresh();
    dialog.setOpen(false);
  };

  const excluir = async (id: string, nome: string) => {
    if (
      !confirm(
        `Excluir "${nome}" e TODOS os dados vinculados? Essa ação não pode ser desfeita.`,
      )
    )
      return;
    await supabase.from("eventos").delete().eq("id", id);
    setEventos((prev) => prev.filter((e) => e.id !== id));
    router.refresh();
  };

  const cols: Column<Evento>[] = [
    { key: "nome", header: "Nome", render: (r) => <strong>{r.nome}</strong> },
    {
      key: "slug",
      header: "Slug",
      render: (r) => (
        <Code variant="outline" colorPalette="gray">
          {r.slug}
        </Code>
      ),
    },
    {
      key: "tipo",
      header: "Tipo",
      width: 130,
      render: (r) => TIPOS[r.tipo].label,
    },
    {
      key: "status",
      header: "Status",
      width: 130,
      render: (r) => {
        const status = STATUS_BADGES[r.status];
        return <Badge colorPalette={status.colorPalette}>{status.label}</Badge>;
      },
    },
    { key: "localidade", header: "Localidade", width: 180 },
    { key: "estado", header: "UF", width: 60 },
    {
      key: "data_inicio",
      header: "Início",
      width: 110,
      render: (r) => new Date(r.data_inicio).toLocaleDateString("pt-BR"),
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
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar evento..."
        />
        <Btn onClick={openCreate}>
          <RiAddFill /> Novo evento
        </Btn>
      </HStack>

      <DataTable columns={cols} rows={filtered} />

      <Modal
        title={mode === "create" ? "Novo evento" : "Editar evento"}
        action={
          <Button type="submit" form="eventos-form" loading={saving}>
            {mode === "create" ? "Criar" : "Salvar"}
          </Button>
        }
      >
        <EventosForm mode={mode} evento={editing} onSubmit={handleOnSubmit} />
      </Modal>
    </Dialog.RootProvider>
  );
}
