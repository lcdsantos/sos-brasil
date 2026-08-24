"use client";

import { Tabs } from "@chakra-ui/react";
import { RiMapPin2Fill, RiBox1Fill } from "react-icons/ri";

import ItensUrgentesAdminTable from "@/components/admin/ItensUrgentesAdminTable";
import LocaisDeDoacaoAdminTable from "@/components/admin/LocaisDeDoacaoAdminTable";
import type { Tables } from "@/types/database";

type LocalDoacao = Tables<"locais_doacao">;
type DoacaoItemUrgente = Tables<"doacao_itens_urgentes">;

export default function DoacoesAdminTable({
  initialLocais,
  initialItens,
  eventos,
}: {
  initialLocais: LocalDoacao[];
  initialItens: DoacaoItemUrgente[];
  eventos: { id: string; nome: string }[];
}) {
  return (
    <Tabs.Root defaultValue="locais-de-coleta">
      <Tabs.List>
        <Tabs.Trigger value="locais-de-coleta">
          <RiMapPin2Fill />
          Locais de coleta
        </Tabs.Trigger>
        <Tabs.Trigger value="itens-urgentes">
          <RiBox1Fill />
          Itens urgentes
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="locais-de-coleta">
        <LocaisDeDoacaoAdminTable
          eventos={eventos}
          initialLocais={initialLocais}
        />
      </Tabs.Content>
      <Tabs.Content value="itens-urgentes">
        <ItensUrgentesAdminTable
          eventos={eventos}
          initialItens={initialItens}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}
