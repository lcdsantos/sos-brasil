"use client";

import { useState } from "react";

import {
  Box,
  VStack,
  Flex,
  Avatar,
  Fieldset,
  Field,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useForm, useWatch } from "react-hook-form";

import ImageUpload from "@/components/admin/ImageUpload";
import { Profile } from "@/components/layout/AuthProvider";
import { toaster } from "@/components/ui/Toaster";
import { createClient } from "@/lib/supabase/client";

type PerfilFormProps = {
  profile?: Profile | null;
};

type ProfileFormData = {
  name: string;
  email: string;
  avatar_url: string | null;
};

export const PerfilForm = ({ profile }: PerfilFormProps) => {
  const supabase = createClient();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, control } =
    useForm<ProfileFormData>({
      defaultValues: {
        name: profile?.name ?? "",
        email: profile?.email ?? "",
        avatar_url: profile?.avatar_url ?? null,
      },
    });

  const avatarUrl = useWatch({
    control,
    name: "avatar_url",
  });
  const currentName = useWatch({
    control,
    name: "name",
  });

  const onSubmit = async ({ name, email, avatar_url }: ProfileFormData) => {
    setError("");
    setIsSubmitting(true);

    if (!profile) {
      return;
    }

    try {
      const authData = {
        email: email !== profile.email ? email : undefined,
        data: {
          name,
          avatar_url: avatar_url ?? null,
        },
      };
      const profileData = {
        id: profile.id,
        email,
        name,
        avatar_url: avatar_url ?? null,
      };

      const { error: authError } = await supabase.auth.updateUser(authData);

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });

      if (profileError) throw profileError;

      toaster.success({
        id: "profile-update",
        title: "Perfil atualizado com sucesso!",
      });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível salvar o perfil.";
      setError(message);
      toaster.error({
        id: "profile-update",
        title: "Erro ao salvar perfil",
        description: message,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={6} align="stretch">
        <Flex justify="center">
          <Avatar.Root size="2xl">
            <Avatar.Fallback name={currentName} />
            {avatarUrl && <Avatar.Image src={avatarUrl} alt={currentName} />}
          </Avatar.Root>
        </Flex>

        <ImageUpload
          value={avatarUrl ?? null}
          folder="profiles"
          onChange={(nextUrl) =>
            setValue("avatar_url", nextUrl, { shouldDirty: true })
          }
        />

        <Fieldset.Root invalid={Boolean(error)}>
          <Fieldset.Content>
            <Field.Root required>
              <Field.Label>Nome</Field.Label>
              <Input {...register("name", { required: true, minLength: 2 })} />
            </Field.Root>

            <Field.Root required>
              <Field.Label>E-mail</Field.Label>
              <Input type="email" {...register("email", { required: true })} />
            </Field.Root>
          </Fieldset.Content>

          {error && (
            <Fieldset.ErrorText>
              <Field.ErrorIcon />
              {error}
            </Fieldset.ErrorText>
          )}
        </Fieldset.Root>

        <Box>
          <Text fontSize="sm" color="fg.muted" mb={2}>
            As alterações de e-mail podem exigir confirmação antes de entrarem
            em vigor.
          </Text>
          <Button type="submit" w="full" loading={isSubmitting}>
            Salvar alterações
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};
