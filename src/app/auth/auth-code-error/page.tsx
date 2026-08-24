import { Container, Alert } from "@chakra-ui/react";

import MobileShell from "@/components/layout/MobileShell";
import PageHeader from "@/components/layout/PageHeader";

export default function AuthCodeErrorPage() {
  return (
    <MobileShell>
      <PageHeader title="Erro de autenticação" />

      <Container maxW="md" py={8}>
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>
            O código de autenticação expirou ou é inválido. Tente novamente.
          </Alert.Title>
        </Alert.Root>
      </Container>
    </MobileShell>
  );
}
