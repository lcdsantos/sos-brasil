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
import { createClient } from "@/lib/supabase/client";

export default function EsqueciSenhaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const onSubmit = async ({ email }: { email: string }) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_URL,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <MobileShell>
      <PageHeader title="Esqueci minha senha" />

      <Container maxW="md" py={8}>
        {sent ? (
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>
              E-mail de recuperação enviado! Verifique sua caixa de entrada.
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
              </Fieldset.Content>
            </Fieldset.Root>

            <Button type="submit" w="full" loading={loading} mt={6} mb={3}>
              Continuar
            </Button>
          </Box>
        )}
      </Container>
    </MobileShell>
  );
}
