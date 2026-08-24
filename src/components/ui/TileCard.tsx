import { ReactNode } from "react";

import Link, { LinkProps } from "next/link";

import { Span } from "@chakra-ui/react";

import Card from "@/components/ui/Card";

type TileCardProps = {
  href: LinkProps["href"];
  icon: ReactNode;
  title: ReactNode;
  subTitle: ReactNode;
};

export default function TileCard({
  href,
  icon,
  title,
  subTitle,
}: TileCardProps) {
  return (
    <Card
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      py={8}
      px={4}
      minH="140px"
      asChild
    >
      <Link href={href}>
        {icon}
        <Span
          fontWeight={700}
          textStyle={{ base: "sm", md: "md" }}
          color="brand.900"
        >
          {title}
        </Span>
        <Span textStyle={{ base: "xs", md: "sm" }} color="brand.600">
          {subTitle}
        </Span>
      </Link>
    </Card>
  );
}
