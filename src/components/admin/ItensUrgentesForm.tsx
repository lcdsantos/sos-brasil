import React from "react";

import { Box, Input, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { Field, Select } from "@/components/admin/ui";
import { Enums, Tables } from "@/types/database";

type ItensUrgentesFormProps = {
  eventos: { id: string; nome: string }[];
  itens?: Partial<Tables<"doacao_itens_urgentes">>;
  onSubmit: (data: LocaisDeDoacaoFormData) => void;
};

type LocaisDeDoacaoFormData = {
  evento_id: string;
  item: string;
  prioridade: string;
};

type PrioridadeEnum = Enums<"prioridade_enum">;

const PRIORIDADES: { value: PrioridadeEnum; label: string }[] = [
  { value: "alta", label: "🔴 Alta" },
  { value: "media", label: "🟡 Média" },
  { value: "baixa", label: "🟢 Baixa" },
];

export const ItensUrgentesForm = React.forwardRef<
  HTMLFormElement,
  ItensUrgentesFormProps
>(function LocaisDeDoacaoForm({ itens, eventos, onSubmit, ...props }, ref) {
  const { register, handleSubmit } = useForm<LocaisDeDoacaoFormData>({
    defaultValues: {
      evento_id: itens?.evento_id ?? "",
      item: itens?.item ?? "",
      prioridade: itens?.prioridade ?? "",
    },
  });

  return (
    <Box
      as="form"
      id="itens-urgentes-form"
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      {...props}
    >
      <VStack gap={4}>
        <Field required label="Evento">
          <Select
            placeholder="Selecione um evento"
            {...register("evento_id", { required: true })}
          >
            {eventos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Item" required>
          <Input {...register("item", { required: true })} />
        </Field>

        <Field label="Prioridade" required>
          <Select {...register("prioridade", { required: true })}>
            {PRIORIDADES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
      </VStack>
    </Box>
  );
});
