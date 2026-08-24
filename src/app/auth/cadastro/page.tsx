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

type CadastroForm = {
  nome: string;
  email: string;
  senha: string;
  repetirSenha: string;
};

export default function CadastroPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroForm>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const onSubmit = async ({
    nome,
    email,
    senha,
    repetirSenha,
  }: CadastroForm) => {
    if (senha !== repetirSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { name: nome },
        emailRedirectTo: process.env.NEXT_PUBLIC_URL,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <MobileShell>
      <PageHeader title="Cadastro" />

      <Container maxW="md" py={8}>
        {sent ? (
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>
              Verifique seu e-mail e confirme sua conta para continuar.
            </Alert.Title>
          </Alert.Root>
        ) : (
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Fieldset.Root invalid={Boolean(error)}>
              <Fieldset.Content>
                <Field.Root required invalid={Boolean(errors.nome)}>
                  <Field.Label>
                    Nome <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    {...register("nome", { required: true, minLength: 2 })}
                  />
                  <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
                </Field.Root>

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
              Cadastrar
            </Button>
          </Box>
        )}
      </Container>
    </MobileShell>
  );
}
