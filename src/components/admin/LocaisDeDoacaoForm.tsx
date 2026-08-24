import React from "react";

import { Box, Input, VStack } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { withMask } from "use-mask-input";

import ImageUpload from "@/components/admin/ImageUpload";
import { Field, Select } from "@/components/admin/ui";
import { Tables } from "@/types/database";

type LocaisDeDoacaoFormProps = {
  eventos: { id: string; nome: string }[];
  local?: Partial<Tables<"locais_doacao">>;
  onSubmit: (data: LocaisDeDoacaoFormData) => void;
};

type LocaisDeDoacaoFormData = {
  evento_id: string;
  nome: string;
  endereco: string;
  contato: string;
  foto_url: string;
};

export const LocaisDeDoacaoForm = React.forwardRef<
  HTMLFormElement,
  LocaisDeDoacaoFormProps
>(function LocaisDeDoacaoForm({ local, eventos, onSubmit, ...props }, ref) {
  const { register, handleSubmit, setValue, watch, control } =
    useForm<LocaisDeDoacaoFormData>({
      defaultValues: {
        evento_id: local?.evento_id ?? "",
        nome: local?.nome ?? "",
        endereco: local?.endereco ?? "",
        contato: local?.contato ?? "",
        foto_url: local?.foto_url ?? "",
      },
    });

  const campos = [
    { key: "nome", label: "Nome do local" },
    { key: "endereco", label: "Endereço" },
  ] as const;

  return (
    <Box
      as="form"
      id="locais-de-doacao-form"
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      {...props}
    >
      <VStack gap={4}>
        <Field required label="Evento">
          <Select placeholder="Selecione um evento" {...register("evento_id")}>
            {eventos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </Select>
        </Field>

        {campos.map(({ key, label }) => (
          <Field key={key} label={label} required>
            <Input {...register(key as keyof LocaisDeDoacaoFormData)} />
          </Field>
        ))}

        <Controller
          name="contato"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Field label="Contato" required>
              <Input
                value={field.value}
                onChange={field.onChange}
                ref={withMask("(99) 99999-9999")}
              />
            </Field>
          )}
        />

        <ImageUpload
          value={watch("foto_url")}
          onChange={(url) =>
            setValue("foto_url", url ?? "", { shouldValidate: true })
          }
          folder="abrigos"
        />
      </VStack>
    </Box>
  );
});
