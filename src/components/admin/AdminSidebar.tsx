"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import {
  Avatar,
  Button,
  HStack,
  Text,
  Stack,
  Separator,
  Heading,
  Link,
} from "@chakra-ui/react";
import {
  RiLogoutBoxLine,
  RiArrowLeftSLine,
  RiFlashlightFill,
  RiHandHeartFill,
  RiHomeHeartFill,
  RiGroupFill,
  RiNewspaperFill,
  RiRoadMapFill,
  RiUser3Fill,
  RiDashboardFill,
} from "react-icons/ri";

import { useAuthContext } from "@/components/layout/AuthProvider";
import { Enums } from "@/types/database";

type RolesEnum = Enums<"user_role_enum">;

const NAV = [
  {
    roles: ["admin", "volunteer"],
    href: "/admin",
    icon: <RiDashboardFill />,
    label: "Dashboard",
  },
  {
    roles: ["admin", "volunteer"],
    href: "/admin/eventos",
    icon: <RiFlashlightFill />,
    label: "Eventos",
  },
  {
    roles: ["admin", "volunteer"],
    href: "/admin/abrigos",
    icon: <RiHomeHeartFill />,
    label: "Abrigos",
  },
  {
    roles: ["admin", "volunteer"],
    href: "/admin/abrigados",
    icon: <RiGroupFill />,
    label: "Abrigados",
  },
  {
    roles: ["admin", "volunteer"],
    href: "/admin/doacoes",
    icon: <RiHandHeartFill />,
    label: "Doações",
  },
  {
    roles: ["admin", "volunteer"],
    href: "/admin/vias",
    icon: <RiRoadMapFill />,
    label: "Vias",
  },
  {
    roles: ["admin", "volunteer"],
    href: "/admin/noticias",
    icon: <RiNewspaperFill />,
    label: "Notícias",
  },
  {
    roles: ["admin"],
    href: "/admin/usuarios",
    icon: <RiUser3Fill />,
    label: "Usuários",
  },
];

const ROLE_LABEL: Record<RolesEnum, string> = {
  admin: "Administrador",
  volunteer: "Voluntário",
  user: "Usuário",
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuthContext();

  return (
    <Stack
      as="aside"
      bg="orange.900"
      height="vh"
      style={{
        flexShrink: 0,
        position: "sticky",
        top: 0,
        width: 220,
      }}
      color="fg.inverted"
    >
      {/* Logo */}
      <Stack gap={1} p={4}>
        <Heading>SOS Brasil</Heading>
        <Text
          textStyle="xs"
          textTransform="uppercase"
          letterSpacing="widest"
          opacity={0.6}
        >
          Back-office
        </Text>
      </Stack>

      <Separator opacity={0.05} />

      <Stack p={2} as="nav">
        {NAV.filter(({ roles }) => roles.includes(profile?.role ?? "")).map(
          ({ href, icon, label }) => {
            const exact = href === "/admin";
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                py={2}
                px={3}
                rounded="md"
                variant="plain"
                aria-current={active ? "page" : undefined}
                _currentPage={{ bg: "white/10", color: "white" }}
                color="fg.inverted/90"
                _hover={{
                  bg: "white/15",
                  color: "white",
                  textDecoration: "none",
                }}
                asChild
              >
                <NextLink href={href}>
                  {icon} {label}
                </NextLink>
              </Link>
            );
          },
        )}
      </Stack>

      <Separator opacity={0.05} mt="auto" />

      {/* User card */}
      <Stack gap={1} p={4}>
        <HStack gap={3} alignItems="center" mb={2}>
          <Avatar.Root>
            <Avatar.Fallback name={profile?.name} />
            <Avatar.Image src={profile?.avatar_url ?? undefined} />
          </Avatar.Root>
          <div style={{ minWidth: 0, lineHeight: 0 }}>
            <Text textStyle="label">
              {profile?.name ?? profile?.email ?? "Admin"}
            </Text>
            <Text
              textStyle="2xs"
              opacity={0.5}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {profile?.role && profile.role in ROLE_LABEL
                ? ROLE_LABEL[profile.role]
                : profile?.role}
            </Text>
          </div>
        </HStack>

        <Button variant="subtle" size="xs" onClick={signOut}>
          <RiLogoutBoxLine />
          Sair
        </Button>

        <Button variant="ghost" size="xs" asChild>
          <NextLink href="/">
            <RiArrowLeftSLine /> Voltar ao app
          </NextLink>
        </Button>
      </Stack>
    </Stack>
  );
}
