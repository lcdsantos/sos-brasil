"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, Dialog, HStack, useDialog } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { AbrigadosForm } from "@/components/admin/AbrigadosForm";
import {
  ActionsColumn,
  Btn,
  Column,
  DataTable,
  Modal,
  SearchBar,
  Select,
  useConfirm,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database";

type Abrigado = Tables<"abrigados">;

const BLANK: Partial<Abrigado> = {
  abrigo_id: "",
  idade: null,
  nome: "",
};

export default function AbrigadosTable({
  initialAbrigados,
  abrigos,
}: {
  initialAbrigados: Abrigado[];
  abrigos: { id: string; nome: string }[];
}) {
  const [abrigados, setAbrigados] = useState(initialAbrigados);
  const [search, setSearch] = useState("");
  const [abrigoFil, setAbrigoFil] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Partial<Abrigado>>(BLANK);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const confirm = useConfirm();
  const dialog = useDialog();
  const supabase = createClient();

  const abrigoNome = (id: string) =>
    abrigos.find((abrigo) => abrigo.id === id)?.nome ?? "—";

  const filtered = abrigados.filter(
    (abrigado) =>
      (abrigoFil ? abrigado.abrigo_id === abrigoFil : true) &&
      abrigado.nome.toLowerCase().includes(search.toLowerCase()),
  );

  const saveAbrigado = async (data: Partial<Abrigado>) => {
    setSaving(true);
    const payload = {
      abrigo_id: data.abrigo_id!,
      nome: data.nome!,
      idade: data.idade || null,
    };

    if (mode === "create") {
      const { data: created } = await supabase
        .from("abrigados")
        .insert(payload)
        .select()
        .single();
      if (created) setAbrigados((prev) => [created, ...prev]);
    } else if (editing.id) {
      const { data: updated } = await supabase
        .from("abrigados")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (updated) {
        setAbrigados((prev) =>
          prev.map((abrigado) =>
            abrigado.id === updated.id ? updated : abrigado,
          ),
        );
      }
    }

    setSaving(false);
    router.refresh();
    dialog.setOpen(false);
  };

  const excluir = async (id: string, nome: string) => {
    if (!confirm(`Excluir o cadastro de "${nome}"?`)) return;
    await supabase.from("abrigados").delete().eq("id", id);
    setAbrigados((prev) => prev.filter((abrigado) => abrigado.id !== id));
  };

  const cols: Column<Abrigado>[] = [
    {
      key: "nome",
      header: "Nome",
      render: (row) => <strong>{row.nome}</strong>,
    },
    {
      key: "idade",
      header: "Idade",
      width: 100,
      render: (row) => (row.idade ? `${row.idade} anos` : "—"),
    },
    {
      key: "abrigo_id",
      header: "Abrigo",
      width: 240,
      render: (row) => abrigoNome(row.abrigo_id),
    },
    {
      key: "acoes",
      header: "Ações",
      width: 0,
      textAlign: "end",
      render: (row) => (
        <ActionsColumn
          onEditClick={() => {
            setEditing(row);
            setMode("edit");
            dialog.setOpen(true);
          }}
          onRemoveClick={() => excluir(row.id, row.nome)}
        />
      ),
    },
  ];

  return (
    <Dialog.RootProvider value={dialog}>
      <HStack justify="space-between" gap={4} mb={4}>
        <HStack align="center" gap={2}>
          <Select
            value={abrigoFil}
            onChange={(event) => setAbrigoFil(event.target.value)}
          >
            <option value="">Todos os abrigos</option>
            {abrigos.map((abrigo) => (
              <option key={abrigo.id} value={abrigo.id}>
                {abrigo.nome}
              </option>
            ))}
          </Select>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar abrigado..."
          />
        </HStack>
        <Btn
          onClick={() => {
            setEditing({ ...BLANK, abrigo_id: abrigoFil || abrigos[0]?.id });
            setMode("create");
            dialog.setOpen(true);
          }}
        >
          <RiAddFill /> Novo abrigado
        </Btn>
      </HStack>

      <DataTable columns={cols} rows={filtered} />

      <Modal
        title={mode === "create" ? "Novo abrigado" : "Editar abrigado"}
        action={
          <Button type="submit" form="abrigados-form" loading={saving}>
            {mode === "create" ? "Criar" : "Salvar"}
          </Button>
        }
      >
        <AbrigadosForm
          abrigos={abrigos}
          abrigado={editing}
          onSubmit={saveAbrigado}
        />
      </Modal>
    </Dialog.RootProvider>
  );
}
