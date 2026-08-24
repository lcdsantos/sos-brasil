"use client";

import * as React from "react";
import { useEffect } from "react";

import {
  Box,
  Input,
  parseDate,
  Separator,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";

import { DatePicker, Field, Select } from "@/components/admin/ui";
import { Enums, Tables } from "@/types/database";
import { slugify } from "@/utils/slugify";

type EventoTipoEnum = Enums<"evento_tipo_enum">;
type EventoStatusEnum = Enums<"evento_status_enum">;

type EventosFormProps = {
  mode: "create" | "edit";
  evento?: Partial<Tables<"eventos">>;
  onSubmit: (data: EventosFormData) => void;
};

type EventosFormData = {
  nome: string;
  slug: string;
  descricao: string;
  tipo: EventoTipoEnum;
  status: EventoStatusEnum;
  localidade: string;
  estado: string;
  data_inicio: string;
};

const TIPOS: { value: EventoTipoEnum; label: string }[] = [
  { value: "enchente", label: "🌊 Enchente" },
  { value: "ciclone", label: "🌀 Ciclone" },
  { value: "incendio", label: "🔥 Incêndio" },
  { value: "seca", label: "☀️ Seca" },
  { value: "deslizamento", label: "⛰️ Deslizamento" },
  { value: "terremoto", label: "🏚️ Terremoto" },
  { value: "outro", label: "⚠️ Outro" },
];

const STATUS: { value: EventoStatusEnum; label: string }[] = [
  { value: "ativo", label: "🔴 Ativo" },
  { value: "monitoramento", label: "🟡 Monitoramento" },
  { value: "encerrado", label: "✅ Encerrado" },
];

const ESTADOS = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];

export const EventosForm = React.forwardRef<HTMLFormElement, EventosFormProps>(
  function EventosForm({ evento, onSubmit, ...props }, ref) {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      watch,
      setValue,
    } = useForm<EventosFormData>({
      defaultValues: {
        nome: evento?.nome ?? "",
        slug: evento?.slug ?? "",
        descricao: evento?.descricao ?? "",
        tipo: evento?.tipo ?? "outro",
        status: evento?.status ?? "ativo",
        localidade: evento?.localidade ?? "",
        estado: evento?.estado ?? "",
        data_inicio: evento?.data_inicio ?? "",
      },
    });

    const nome = watch("nome");

    useEffect(() => {
      const slug = slugify(nome);
      setValue("slug", slug);
    }, [nome, setValue]);

    return (
      <Box
        as="form"
        id="eventos-form"
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
        {...props}
      >
        <VStack gap={4}>
          <Field label="Nome" required>
            <Input
              {...register("nome", { required: true })}
              placeholder="Ex: Enchentes RS 2024"
            />
          </Field>

          <Field label="Slug" required>
            <Input
              readOnly
              disabled
              {...register("slug", { required: true })}
            />
          </Field>

          <Field label="Descrição" required>
            <Textarea
              {...register("descricao", { required: true })}
              placeholder="Breve descrição..."
            />
          </Field>

          <Field label="Tipo" required>
            <Select {...register("tipo", { required: true })}>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Status" required>
            <Select {...register("status", { required: true })}>
              {STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>

          <Separator />

          <Field label="Localidade" required>
            <Input
              {...register("localidade", { required: true })}
              placeholder="Rio Grande do Sul"
            />
          </Field>

          <Field label="UF" required>
            <Select {...register("estado", { required: true })}>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </Select>
          </Field>

          <Separator />

          <Controller
            control={control}
            name="data_inicio"
            render={({ field }) => (
              <DatePicker
                label="Data de início"
                value={field.value ? [parseDate(new Date(field.value))] : []}
                onValueChange={(e) =>
                  field.onChange(e.value[0]?.toString() ?? "")
                }
                invalid={!!errors.data_inicio}
                errorText={errors.data_inicio?.message}
                required
              />
            )}
          />
        </VStack>
      </Box>
    );
  },
);
