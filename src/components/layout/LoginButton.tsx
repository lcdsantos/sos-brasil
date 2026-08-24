"use client";

import Link from "next/link";

import { Avatar, Box, IconButton, Menu, Text } from "@chakra-ui/react";
import { RiUserAddFill } from "react-icons/ri";

import { useAuthContext } from "@/components/layout/AuthProvider";

type LoginButtonProps = {
  inverted?: boolean;
};

export default function LoginButton({ inverted }: LoginButtonProps) {
  const { profile, isAdmin, isVolunteer, signOut } = useAuthContext();

  if (profile) {
    return (
      <Menu.Root>
        <Menu.Trigger rounded="full" focusRing="outside">
          <Avatar.Root size="md" cursor="pointer">
            <Avatar.Fallback name={profile?.name} />
            <Avatar.Image
              src={profile?.avatar_url ?? undefined}
              alt={profile?.name}
            />
          </Avatar.Root>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content>
            <Box p={2}>
              <Text textStyle="sm">{profile?.name}</Text>
              <Text textStyle="xs" color="fg.muted" pt={1}>
                {profile?.email}
              </Text>
            </Box>

            <Menu.Separator />

            <Menu.Item value="go-to-profile" asChild>
              <Link href="/perfil">Meu perfil</Link>
            </Menu.Item>

            {(isAdmin || isVolunteer) && (
              <>
                <Menu.Item value="go-to-admin-page" asChild>
                  <Link href="/admin">Ir para painel administrativo</Link>
                </Menu.Item>
                <Menu.Separator />
              </>
            )}

            <Menu.Item value="sign-out" onClick={signOut}>
              Sair
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    );
  }

  return (
    <IconButton
      aria-label="Entrar"
      variant={inverted ? "surface" : "ghost"}
      size="md"
      rounded="full"
      asChild
    >
      <Link href="/auth/login">
        <RiUserAddFill size={20} />
      </Link>
    </IconButton>
  );
}
