"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Badge, BadgeProps, HStack, Text } from "@chakra-ui/react";

import { createClient } from "@/lib/supabase/client";
import type { Tables, Enums } from "@/types/database";

import { DataTable, Column, SearchBar, Select } from "./ui";

type Profile = Tables<"profiles">;
type UserRolesEnum = Enums<"user_role_enum">;

const ROLES: { value: UserRolesEnum; label: string }[] = [
  { value: "admin", label: "Administrador" },
  { value: "volunteer", label: "Voluntário" },
  { value: "user", label: "Usuário" },
];

const BADGE_COLORS: Record<UserRolesEnum, { label: string } & BadgeProps> = {
  admin: { label: "Administrador", colorPalette: "blue" },
  volunteer: { label: "Voluntário", colorPalette: "orange" },
  user: { label: "Usuário", colorPalette: "gray" },
};

export default function UsuariosTable({
  initialUsuarios,
}: {
  initialUsuarios: Profile[];
}) {
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const filtered = usuarios.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const changeRole = async (id: string, role: UserRolesEnum) => {
    setSaving(id);

    const { data } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (data) {
      setUsuarios((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    }

    setSaving(null);
    router.refresh();
  };

  const cols: Column<Profile>[] = [
    { key: "name", header: "Nome", render: (r) => <strong>{r.name}</strong> },
    { key: "email", header: "E-mail", width: 240 },
    {
      key: "role",
      header: "Perfil",
      width: 110,
      render: (r) => (
        <Badge colorPalette={BADGE_COLORS[r.role].colorPalette}>
          {BADGE_COLORS[r.role].label}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Cadastro",
      width: 110,
      render: (r) => new Date(r.created_at).toLocaleDateString("pt-BR"),
    },
    {
      key: "acoes",
      header: "Alterar perfil",
      width: 200,
      render: (r) => (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Select
            value={r.role}
            onChange={(e) => changeRole(r.id, e.target.value as UserRolesEnum)}
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
          {saving === r.id && (
            <span style={{ fontSize: 11, color: "#8b6060" }}>Salvando...</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <HStack justify="space-between" gap={4} mb={4}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou e-mail..."
        />
      </HStack>

      <DataTable
        columns={cols}
        rows={filtered}
        emptyMessage="Nenhum usuário encontrado."
      />

      <Text textStyle="sm" mt={4} color="fg.muted">
        💡 A alteração de perfil é imediata. Usuários com perfil{" "}
        <Badge colorPalette={BADGE_COLORS["admin"].colorPalette}>
          {BADGE_COLORS["admin"].label}
        </Badge>{" "}
        têm acesso a este painel.
      </Text>
    </>
  );
}
