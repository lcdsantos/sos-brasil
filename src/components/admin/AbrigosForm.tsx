"use client";

import * as React from "react";

import { Box, Input, VStack } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { withMask } from "use-mask-input";

import { Field, Select } from "@/components/admin/ui";
import { Tables } from "@/types/database";

import ImageUpload from "./ImageUpload";

type AbrigosFormProps = {
  eventos: { id: string; nome: string }[];
  abrigo?: Partial<Tables<"abrigos_com_contagem">>;
  onSubmit: (data: AbrigoFormData) => void;
};

type AbrigoFormData = {
  evento_id: string;
  nome: string;
  endereco: string;
  contato: string;
  foto_url: string;
};

export const AbrigosForm = React.forwardRef<HTMLFormElement, AbrigosFormProps>(
  function AbrigosForm({ abrigo, eventos, onSubmit, ...props }, ref) {
    const { register, handleSubmit, setValue, watch, control } =
      useForm<AbrigoFormData>({
        defaultValues: {
          evento_id: abrigo?.evento_id ?? "",
          nome: abrigo?.nome ?? "",
          endereco: abrigo?.endereco ?? "",
          contato: abrigo?.contato ?? "",
          foto_url: abrigo?.foto_url ?? "",
        },
      });

    const campos = [
      { key: "nome", label: "Nome do abrigo" },
      { key: "endereco", label: "Endereço" },
    ] as const;

    return (
      <Box
        as="form"
        id="abrigos-form"
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
        {...props}
      >
        <VStack gap={4}>
          <Field required label="Evento">
            <Select
              placeholder="Selecione um evento"
              {...register("evento_id")}
            >
              {eventos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </Select>
          </Field>

          <ImageUpload
            value={watch("foto_url")}
            onChange={(url) =>
              setValue("foto_url", url ?? "", { shouldValidate: true })
            }
            folder="abrigos"
          />

          {campos.map(({ key, label }) => (
            <Field key={key} label={label} required>
              <Input {...register(key as keyof AbrigoFormData)} />
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
        </VStack>
      </Box>
    );
  },
);
