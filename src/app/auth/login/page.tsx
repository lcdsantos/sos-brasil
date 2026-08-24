"use client";

import { useState } from "react";

import NextLink from "next/link";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Separator,
  Flex,
  Input,
  Text,
  VStack,
  Link,
  Fieldset,
  Field,
  Container,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { RiGoogleFill, RiFacebookFill, RiWindowsFill } from "react-icons/ri";

import MobileShell from "@/components/layout/MobileShell";
import PageHeader from "@/components/layout/PageHeader";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { createClient } from "@/lib/supabase/client";

type LoginForm = {
  email: string;
  senha: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const onSubmit = async ({ email, senha }: LoginForm) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) {
      if (error.code === "validation_failed") {
        setError("Usuário ou senha inválidos.");
      } else if (error.code === "invalid_credentials") {
        setError("Usuário ou senha incorretos.");
      } else if (error.code === "email_not_confirmed") {
        setError("E-mail não confirmado.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else router.push("/");
  };

  const oauthLogin = async (
    provider: "google" | "apple" | "facebook" | "azure",
  ) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: process.env.NEXT_PUBLIC_URL },
    });
  };

  const OAUTH = [
    { provider: "google" as const, label: "Google", Icon: RiGoogleFill },
    { provider: "facebook" as const, label: "Facebook", Icon: RiFacebookFill },
    { provider: "azure" as const, label: "Microsoft", Icon: RiWindowsFill },
  ];

  return (
    <MobileShell>
      <PageHeader title="Login" />

      <Container maxW="md" py={8}>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset.Root invalid={Boolean(error)}>
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>E-mail</Field.Label>
                <Input type="email" {...register("email")} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Senha</Field.Label>
                <PasswordInput {...register("senha")} />
              </Field.Root>
            </Fieldset.Content>
            {error && (
              <Fieldset.ErrorText>
                <Field.ErrorIcon />
                {error}
              </Fieldset.ErrorText>
            )}
          </Fieldset.Root>

          <Button type="submit" w="full" loading={loading} mt={6} mb={3}>
            Continuar
          </Button>

          <Flex justify="center" gap={4} mb={4}>
            <Link
              as={NextLink}
              href="/auth/cadastro"
              variant="underline"
              _hover={{ textDecoration: "none" }}
            >
              Cadastro
            </Link>
            <Text fontSize="sm" color="brand.400">
              •
            </Text>
            <Link
              as={NextLink}
              href="/auth/esqueci-senha"
              variant="underline"
              _hover={{ textDecoration: "none" }}
            >
              Esqueci minha senha
            </Link>
          </Flex>

          <Flex align="center" gap={4} my={4}>
            <Separator flex={1} />
            <Text fontSize="sm" whiteSpace="nowrap">
              ou
            </Text>
            <Separator flex={1} />
          </Flex>

          <VStack gap={3}>
            {OAUTH.map(({ provider, label, Icon }) => (
              <Button
                key={provider}
                variant="subtle"
                w="full"
                onClick={() => oauthLogin(provider)}
              >
                <Icon size={16} />
                Continuar com {label}
              </Button>
            ))}
          </VStack>
        </Box>
      </Container>
    </MobileShell>
  );
}
