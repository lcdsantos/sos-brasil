import { Box, Icon, List, Text } from "@chakra-ui/react";

import type { Tables } from "@/types/database";

type PriorityListProps = {
  label: React.ReactNode;
  icon: React.ReactNode;
  items: Tables<"doacao_itens_urgentes">[];
  bg: string;
};

export default function PriorityList({
  label,
  icon,
  items,
  bg,
}: PriorityListProps) {
  if (!items.length) return null;

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor="brand.200"
      borderRadius="12px"
      p={4}
    >
      <Text fontWeight={700} mb={2}>
        <Icon size="lg" verticalAlign="top" mr={2} aria-hidden="true">
          {icon}
        </Icon>
        {label}
      </Text>
      <List.Root as="ol" pl={5}>
        {items.map(({ id, item }) => (
          <List.Item key={id}>{item}</List.Item>
        ))}
      </List.Root>
    </Box>
  );
}
