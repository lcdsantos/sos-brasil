import { PropsWithChildren } from "react";

import { Flex, FlexProps } from "@chakra-ui/react";

export default function Card({
  children,
  ...props
}: PropsWithChildren<FlexProps>) {
  return (
    <Flex
      gap={2}
      color="brand.700"
      bg="brand.50"
      border="1px solid"
      borderColor="brand.200"
      borderRadius="xl"
      p={6}
      cursor="pointer"
      _hover={{
        bg: "brand.100",
        borderColor: "brand.300",
        transform: "translateY(-2px)",
        textDecoration: "none",
      }}
      transition="all 0.15s"
      {...props}
    >
      {children}
    </Flex>
  );
}
