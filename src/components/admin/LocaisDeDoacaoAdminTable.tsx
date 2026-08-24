"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { HStack, Dialog, Button, useDialog } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { LocaisDeDoacaoForm } from "@/components/admin/LocaisDeDoacaoForm";
import {
  EventoSelect,
  SearchBar,
  Btn,
  DataTable,
  Column,
  Modal,
  ActionsColumn,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database";

type LocalDoacao = Tables<"locais_doacao">;

const BLANK: LocalDoacao = {
  contato: null,
  created_at: "",
  created_by: null,
  endereco: "",
  evento_id: "",
  foto_url: null,
  id: "",
  nome: "",
  updated_at: "",
};

export default function LocaisDeDoacaoAdminTable({
  initialLocais,
  eventos,
}: {
  initialLocais: LocalDoacao[];
  eventos: { id: string; nome: string }[];
}) {
  const [locais, setLocais] = useState(initialLocais);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Partial<LocalDoacao>>(BLANK);
  const [search, setSearch] = useState("");
  const [eventoFil, setEventoFil] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const dialog = useDialog();
  const supabase = createClient();

  const filteredLocais = locais.filter(
    (l) =>
      (eventoFil ? l.evento_id === eventoFil : true) &&
      l.nome.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOnSubmit = async (data: Partial<LocalDoacao>) => {
    setSaving(true);

    const payload = {
      nome: data.nome!,
      endereco: data.endereco!,
      contato: data.contato || null,
      evento_id: data.evento_id!,
      foto_url: data.foto_url || "",
    };

    if (mode === "create") {
      const { data } = await supabase
        .from("locais_doacao")
        .insert(payload)
        .select()
        .single();

      if (data) {
        setLocais((prev) => [data, ...prev]);
      }
    } else if (editing.id) {
      const { data } = await supabase
        .from("locais_doacao")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();

      if (data) {
        setLocais((prev) => prev.map((l) => (l.id === data.id ? data : l)));
      }
    }

    setSaving(false);
    router.refresh();
    dialog.setOpen(false);
  };

  const excluir = async (id: string, nome: string) => {
    if (!confirm(`Excluir "${nome}"?`)) return;
    await supabase.from("locais_doacao").delete().eq("id", id);
    setLocais((prev) => prev.filter((l) => l.id !== id));
  };

  const eventoNome = (id: string) =>
    eventos.find((e) => e.id === id)?.nome ?? "—";

  const colsLocais: Column<LocalDoacao>[] = [
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
            placeholder="Buscar local..."
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
          <RiAddFill /> Novo local
        </Btn>
      </HStack>

      <DataTable columns={colsLocais} rows={filteredLocais} />

      <Modal
        title={mode === "create" ? "Novo local" : "Editar local"}
        action={
          <Button type="submit" form="locais-de-doacao-form" loading={saving}>
            {mode === "create" ? "Criar" : "Salvar"}
          </Button>
        }
      >
        <LocaisDeDoacaoForm
          eventos={eventos}
          local={editing}
          onSubmit={handleOnSubmit}
        />
      </Modal>
    </Dialog.RootProvider>
  );
}
