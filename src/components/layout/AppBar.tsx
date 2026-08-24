import React from "react";

import Link, { LinkProps } from "next/link";

import { Flex, Heading, IconButton } from "@chakra-ui/react";

type HeaderProps = {
  title: string;
  icon: React.ReactNode;
  iconLabel: string;
  iconLink: LinkProps["href"];
};

export default function AppBar({
  title,
  icon,
  iconLabel,
  iconLink,
}: HeaderProps) {
  return (
    <Flex align="center" justify="space-between" px={5} py={4}>
      <Heading as="h1" size="lg" fontFamily="body" fontWeight={700}>
        {title}
      </Heading>
      <Link href={iconLink}>
        <IconButton
          aria-label={iconLabel}
          variant="ghost"
          size="lg"
          rounded="full"
        >
          {icon}
        </IconButton>
      </Link>
    </Flex>
  );
}
