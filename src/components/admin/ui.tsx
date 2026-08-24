"use client";

import * as React from "react";

import {
  Box,
  Button,
  ButtonProps,
  Center,
  DatePicker as ChakraDatePicker,
  Field as ChakraField,
  CloseButton,
  Dialog,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  NativeSelect,
  NativeSelectFieldProps,
  Portal,
  Table,
  TableColumnHeaderProps,
  Text,
} from "@chakra-ui/react";
import {
  RiCalendar2Fill,
  RiDeleteBin7Fill,
  RiPencilFill,
  RiSearchLine,
} from "react-icons/ri";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Column<T> extends TableColumnHeaderProps {
  key: string;
  header: string;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
}

// ─── DataTable ───────────────────────────────────────────────────────────────
export function DataTable<
  T extends { id: string | null; [key: string]: React.ReactNode }
>({
  columns,
  rows,
  onRowClick,
  emptyMessage = "Nenhum registro encontrado.",
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}) {
  return (
    <Table.Root striped variant="outline" size="sm">
      <Table.Header>
        <Table.Row>
          {columns.map(({ header, key, ...props }) => (
            <Table.ColumnHeader key={key} {...props}>
              {header}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={columns.length} textAlign="center" p={8}>
              {emptyMessage}
            </Table.Cell>
          </Table.Row>
        ) : (
          rows.map((row) => (
            <Table.Row
              key={row.id}
              onClick={() => onRowClick?.(row)}
              css-cursor={onRowClick ? "pointer" : undefined}
            >
              {columns.map((col) => (
                <Table.Cell key={col.key}>
                  {col.render ? col.render(row) : row[col.key] ?? "—"}
                </Table.Cell>
              ))}
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
}

// ─── PageHeader ──────────────────────────────────────────────────────────────
export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <Flex justifyContent="space-between" mb={8}>
      <div>
        <Heading as="h1" size="2xl">
          {title}
        </Heading>
        {subtitle && (
          <Text textStyle="sm" pt={2}>
            {subtitle}
          </Text>
        )}
      </div>
      {action && <div>{action}</div>}
    </Flex>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <Center
      py={5}
      px={6}
      rounded="lg"
      bg="bg.panel"
      border="1px solid"
      borderColor="border.emphasized"
    >
      <HStack gap={5} width="full">
        <Text
          textStyle="4xl"
          lineHeight="1"
          width="9"
          textAlign="center"
          color="orange.800"
        >
          {icon}
        </Text>
        <Box flex={1}>
          <Text
            textStyle="xl"
            fontWeight="bold"
            lineHeight={1}
            color="brand.700"
          >
            {value}
          </Text>
          <Text textStyle="xs" color="brand.600">
            {label}
          </Text>
        </Box>
      </HStack>
    </Center>
  );
}

// ─── Btn ─────────────────────────────────────────────────────────────────────
export function Btn({
  children,
  disabled,
  loading,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <Button
      type={type}
      disabled={disabled || loading}
      loading={loading}
      {...props}
    >
      {children}
    </Button>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({
  title,
  action,
  children,
}: React.PropsWithChildren<{
  title: React.ReactNode;
  action?: React.ReactNode;
}>) {
  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>{children}</Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="ghost">Cancelar</Button>
            </Dialog.ActionTrigger>
            {action}
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────
export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { label, children, helperText, errorText, optionalText, ...rest } =
      props;
    return (
      <ChakraField.Root ref={ref} {...rest}>
        {label && (
          <ChakraField.Label>
            {label}
            <ChakraField.RequiredIndicator fallback={optionalText} />
          </ChakraField.Label>
        )}
        {children}
        {helperText && (
          <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
        )}
        {errorText && (
          <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    );
  }
);

// ─── DatePicker ──────────────────────────────────────────────────────────────
export function DatePicker({
  required,
  invalid,
  label,
  placeholder,
  errorText,
  ...props
}: ChakraDatePicker.RootProps & {
  label?: string;
  placeholder?: string;
  errorText?: string;
}) {
  return (
    <ChakraField.Root invalid={!!invalid} required={!!required}>
      <ChakraDatePicker.Root locale="pt-BR" {...props}>
        <ChakraDatePicker.Label>
          {label} <ChakraField.RequiredIndicator />
        </ChakraDatePicker.Label>
        <ChakraDatePicker.Control>
          <ChakraDatePicker.Input placeholder={placeholder} />
          <ChakraDatePicker.IndicatorGroup>
            <ChakraDatePicker.Trigger>
              <RiCalendar2Fill />
            </ChakraDatePicker.Trigger>
          </ChakraDatePicker.IndicatorGroup>
        </ChakraDatePicker.Control>
        <Portal>
          <ChakraDatePicker.Positioner>
            <ChakraDatePicker.Content>
              <ChakraDatePicker.View view="day">
                <ChakraDatePicker.Header />
                <ChakraDatePicker.DayTable />
              </ChakraDatePicker.View>
              <ChakraDatePicker.View view="month">
                <ChakraDatePicker.Header />
                <ChakraDatePicker.MonthTable />
              </ChakraDatePicker.View>
              <ChakraDatePicker.View view="year">
                <ChakraDatePicker.Header />
                <ChakraDatePicker.YearTable />
              </ChakraDatePicker.View>
            </ChakraDatePicker.Content>
          </ChakraDatePicker.Positioner>
        </Portal>
      </ChakraDatePicker.Root>
      <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
    </ChakraField.Root>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
export const Select = React.forwardRef<
  HTMLSelectElement,
  NativeSelectFieldProps
>(function Select(props, ref) {
  return (
    <NativeSelect.Root>
      <NativeSelect.Field ref={ref} {...props} />
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
});

// ─── Confirm dialog (simple) ──────────────────────────────────────────────────
export function useConfirm() {
  return (msg: string) => window.confirm(msg);
}

// ─── SearchBar ───────────────────────────────────────────────────────────────
export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <InputGroup startElement={<RiSearchLine />}>
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  );
}

// ─── EventoSelect ────────────────────────────────────────────────────────────
export function EventoSelect({
  eventos,
  value,
  onChange,
}: {
  eventos: { id: string; nome: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Select
      placeholder="Todos os eventos"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {eventos.map((e) => (
        <option key={e.id} value={e.id}>
          {e.nome}
        </option>
      ))}
    </Select>
  );
}

// ─── ActionsColumn ───────────────────────────────────────────────────────────
export function ActionsColumn({
  onEditClick,
  onRemoveClick,
}: {
  onEditClick: React.MouseEventHandler<HTMLButtonElement>;
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <HStack gap={2}>
      <IconButton
        size="xs"
        variant="subtle"
        rounded="full"
        onClick={onEditClick}
      >
        <RiPencilFill />
      </IconButton>
      <IconButton
        size="xs"
        variant="solid"
        rounded="full"
        onClick={onRemoveClick}
      >
        <RiDeleteBin7Fill />
      </IconButton>
    </HStack>
  );
}
