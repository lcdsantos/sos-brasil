"use client";

import * as React from "react";

import { Box, Input, parseDate, Textarea, VStack } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";

import { DatePicker, Field, Select } from "@/components/admin/ui";
import { Enums, Tables } from "@/types/database";

type NoticiaTagEnum = Enums<"noticia_tag_enum">;

type NoticiasFormProps = {
  eventos: { id: string; nome: string }[];
  noticia?: Partial<Tables<"noticias">>;
  onSubmit: (data: NoticiaFormData) => void;
};

type NoticiaFormData = {
  evento_id: string;
  titulo: string;
  texto: string;
  tag: NoticiaTagEnum;
  fonte: string;
  publicado_em: string;
};

const TAGS: { value: NoticiaTagEnum; label: string }[] = [
  { value: "alerta", label: "🔴 Alerta" },
  { value: "informativo", label: "ℹ️ Informativo" },
  { value: "boas_noticias", label: "✅ Boas notícias" },
  { value: "transito", label: "🚗 Trânsito" },
  { value: "previsao_tempo", label: "🌦 Previsão do tempo" },
];

export const NoticiasForm = React.forwardRef<
  HTMLFormElement,
  NoticiasFormProps
>(function NoticiasForm({ noticia, eventos, onSubmit, ...props }, ref) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NoticiaFormData>({
    defaultValues: {
      evento_id: noticia?.evento_id ?? "",
      titulo: noticia?.titulo ?? "",
      texto: noticia?.texto ?? "",
      tag: noticia?.tag ?? "informativo",
      fonte: noticia?.fonte ?? "",
      publicado_em: noticia?.publicado_em ?? "",
    },
  });

  return (
    <Box
      as="form"
      id="noticia-form"
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

        <Field label="Título" required>
          <Input {...register("titulo", { required: true })} />
        </Field>

        <Field label="Texto" required>
          <Textarea
            {...register("texto", { required: true })}
            style={{ minHeight: 100 }}
          />
        </Field>

        <Field label="Categoria" required>
          <Select {...register("tag", { required: true })}>
            {TAGS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Fonte">
          <Input {...register("fonte")} />
        </Field>

        <Controller
          control={control}
          name="publicado_em"
          render={({ field }) => (
            <DatePicker
              label="Data de publicação"
              value={field.value ? [parseDate(new Date(field.value))] : []}
              onValueChange={(e) =>
                field.onChange(e.value[0]?.toString() ?? "")
              }
              invalid={!!errors.publicado_em}
              errorText={errors.publicado_em?.message}
              required
            />
          )}
        />
      </VStack>
    </Box>
  );
});
