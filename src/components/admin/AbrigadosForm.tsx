import React from "react";

import { Box, Input, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { Field, Select } from "@/components/admin/ui";
import { Tables } from "@/types/database";

type AbrigadosFormProps = {
  abrigos: { id: string; nome: string }[];
  abrigado?: Partial<Tables<"abrigados">>;
  onSubmit: (data: Partial<Tables<"abrigados">>) => void;
};

export const AbrigadosForm = React.forwardRef<
  HTMLFormElement,
  AbrigadosFormProps
>(function AbrigadosForm({ abrigos, abrigado, onSubmit, ...props }, ref) {
  const { register, handleSubmit } = useForm<Partial<Tables<"abrigados">>>({
    defaultValues: {
      abrigo_id: abrigado?.abrigo_id ?? "",
      nome: abrigado?.nome ?? "",
      idade: abrigado?.idade ?? undefined,
    },
  });

  return (
    <Box
      as="form"
      id="abrigados-form"
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      {...props}
    >
      <VStack gap={4}>
        <Field required label="Abrigo">
          <Select
            placeholder="Selecione um abrigo"
            {...register("abrigo_id", { required: true })}
          >
            {abrigos.map((abrigo) => (
              <option key={abrigo.id} value={abrigo.id}>
                {abrigo.nome}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Nome" required>
          <Input {...register("nome", { required: true })} />
        </Field>

        <Field label="Idade" optionalText="(opcional)">
          <Input
            type="number"
            min={0}
            max={150}
            {...register("idade", { valueAsNumber: true, min: 0, max: 150 })}
          />
        </Field>
      </VStack>
    </Box>
  );
});
