"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { RiArrowLeftLine } from "react-icons/ri";

type PageHeaderProps = {
  title?: string | null;
  action?: React.ReactNode;
  backLink?: string;
};

export default function PageHeader({
  title,
  action,
  backLink,
}: PageHeaderProps) {
  const router = useRouter();

  const handleOnBackButtonClick = () => {
    if (!backLink) router.back();
  };

  return (
    <Box>
      <Flex align="center" justify="space-between" p={4}>
        <IconButton
          onClick={handleOnBackButtonClick}
          aria-label="Voltar"
          variant="ghost"
          rounded="full"
          asChild={Boolean(backLink)}
        >
          {backLink ? (
            <Link href={backLink}>
              <RiArrowLeftLine />
            </Link>
          ) : (
            <RiArrowLeftLine />
          )}
        </IconButton>
        {action}
      </Flex>
      {title && (
        <Heading as="h1" size="xl" px={4} pb={6}>
          {title}
        </Heading>
      )}
    </Box>
  );
}
