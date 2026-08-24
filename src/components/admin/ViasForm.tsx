import React, { useState } from "react";

import { AspectRatio, Box, Textarea, VStack } from "@chakra-ui/react";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Controller, useForm } from "react-hook-form";

import { Field, Select } from "@/components/admin/ui";
import { Tables } from "@/types/database";

import { PlaceAutocomplete } from "../ui/PlaceAutocomplete";

type ViasFormProps = {
  eventos: { id: string; nome: string }[];
  via?: Partial<Tables<"vias_interditadas">>;
  onSubmit: (data: ViaFormData) => void;
};

export type ViaFormData = {
  evento_id: string;
  endereco: string;
  motivo: string;
  latitude: number;
  longitude: number;
  ativa: boolean;
  google_maps_place_id: string;
};

export const ViasForm = React.forwardRef<HTMLFormElement, ViasFormProps>(
  function ViasForm({ via, eventos, onSubmit, ...props }, ref) {
    const { control, register, handleSubmit, getValues, setValue } =
      useForm<ViaFormData>({
        defaultValues: {
          evento_id: via?.evento_id ?? "",
          endereco: via?.endereco ?? "",
          motivo: via?.motivo ?? "",
          latitude: via?.latitude ?? 0,
          longitude: via?.longitude ?? 0,
          ativa: via?.ativa ?? false,
          google_maps_place_id: via?.google_maps_place_id ?? "",
        },
      });

    const [selectedPlaceId, setSelectedPlaceId] = useState<
      google.maps.places.PlacePrediction["placeId"]
    >(getValues("google_maps_place_id"));

    return (
      <Box
        as="form"
        id="via-form"
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

          <Controller
            render={({ field }) => (
              <PlaceAutocomplete
                inputValue={field.value}
                onInputValueChange={(e) => field.onChange(e)}
                onPlaceSelect={(id) => {
                  setValue("google_maps_place_id", id);
                  setSelectedPlaceId(id);
                }}
              />
            )}
            name="endereco"
            control={control}
          />

          {selectedPlaceId && (
            <AspectRatio bg="bg.muted" w="full" ratio={16 / 9}>
              <GoogleMapsEmbed
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
                height="100%"
                width="100%"
                mode="place"
                language="pt-BR"
                q={`place_id:${selectedPlaceId}`}
              />
            </AspectRatio>
          )}

          {/* <Field label="Endereço" required>
            <Input {...register("endereco", { required: true })} />
          </Field> */}
          {/* <HStack gap={4} width="full">
            <Field label="Latitude">
              <Input type="number" step="any" {...register("latitude")} />
            </Field>
            <Field label="Longitude">
              <Input type="number" step="any" {...register("longitude")} />
            </Field>
          </HStack> */}

          <Field label="Motivo">
            <Textarea {...register("motivo")} />
          </Field>

          <Field label="Status">
            <Select {...register("ativa")}>
              <option value="true">🔴 Ativa</option>
              <option value="false">✅ Inativa</option>
            </Select>
          </Field>
        </VStack>
      </Box>
    );
  }
);
