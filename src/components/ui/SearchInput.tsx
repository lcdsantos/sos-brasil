"use client";

import { Input, InputGroup, InputProps } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";

type SearchInputProps = InputProps;

export default function SearchInput({
  placeholder = "Buscar",
  ...props
}: SearchInputProps) {
  return (
    <InputGroup flex="1" startElement={<RiSearchLine />}>
      <Input size="lg" placeholder={placeholder} {...props} />
    </InputGroup>
  );
}
