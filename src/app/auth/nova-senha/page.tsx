"use client";

import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Container,
  Field,
  Fieldset,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import MobileShell from "@/components/layout/MobileShell";
import PageHeader from "@/components/layout/PageHeader";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { createClient } from "@/lib/supabase/client";

type NovaSenhaForm = {
  email: string;
  senha: string;
  repetirSenha: string;
};

export default function NovaSenhaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NovaSenhaForm>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const onSubmit = async ({ email, senha, repetirSenha }: NovaSenhaForm) => {
    if (senha !== repetirSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: senha,
    });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <MobileShell>
      <PageHeader title="Cadastrar nova senha" />

      <Container maxW="md" py={8}>
        {sent ? (
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>
              Senha alterada com sucesso! Você já pode fazer login com sua nova
              senha.
            </Alert.Title>
          </Alert.Root>
        ) : (
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Fieldset.Root invalid={Boolean(error)}>
              <Fieldset.Content>
                <Field.Root required invalid={Boolean(errors.email)}>
                  <Field.Label>
                    E-mail <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "E-mail inválido",
                      },
                    })}
                  />
                  <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={Boolean(errors.senha)}>
                  <Field.Label>
                    Senha <Field.RequiredIndicator />
                  </Field.Label>
                  <PasswordInput
                    {...register("senha", { required: true, minLength: 6 })}
                  />
                  <Field.ErrorText>{errors.senha?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={Boolean(errors.repetirSenha)}>
                  <Field.Label>
                    Repetir senha <Field.RequiredIndicator />
                  </Field.Label>
                  <PasswordInput
                    {...register("repetirSenha", {
                      required: true,
                      validate: (value, values) => {
                        return values.senha === value || "Senhas diferentes!";
                      },
                    })}
                  />
                  <Field.ErrorText>
                    {errors.repetirSenha?.message}
                  </Field.ErrorText>
                </Field.Root>
              </Fieldset.Content>

              {error && (
                <Fieldset.ErrorText>
                  <Field.ErrorIcon size="sm" />
                  {error}
                </Fieldset.ErrorText>
              )}
            </Fieldset.Root>

            <Button type="submit" w="full" loading={loading} mt={6} mb={3}>
              Cadastrar nova senha
            </Button>
          </Box>
        )}
      </Container>
    </MobileShell>
  );
}
