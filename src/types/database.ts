export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      abrigados: {
        Row: {
          abrigo_id: string;
          created_at: string;
          id: string;
          idade: number | null;
          nome: string;
        };
        Insert: {
          abrigo_id: string;
          created_at?: string;
          id?: string;
          idade?: number | null;
          nome: string;
        };
        Update: {
          abrigo_id?: string;
          created_at?: string;
          id?: string;
          idade?: number | null;
          nome?: string;
        };
        Relationships: [
          {
            foreignKeyName: "abrigados_abrigo_id_fkey";
            columns: ["abrigo_id"];
            isOneToOne: false;
            referencedRelation: "abrigos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "abrigados_abrigo_id_fkey";
            columns: ["abrigo_id"];
            isOneToOne: false;
            referencedRelation: "abrigos_com_contagem";
            referencedColumns: ["id"];
          },
        ];
      };
      abrigo_itens_urgentes: {
        Row: {
          abrigo_id: string;
          created_at: string;
          id: string;
          item: string;
        };
        Insert: {
          abrigo_id: string;
          created_at?: string;
          id?: string;
          item: string;
        };
        Update: {
          abrigo_id?: string;
          created_at?: string;
          id?: string;
          item?: string;
        };
        Relationships: [
          {
            foreignKeyName: "abrigo_itens_urgentes_abrigo_id_fkey";
            columns: ["abrigo_id"];
            isOneToOne: false;
            referencedRelation: "abrigos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "abrigo_itens_urgentes_abrigo_id_fkey";
            columns: ["abrigo_id"];
            isOneToOne: false;
            referencedRelation: "abrigos_com_contagem";
            referencedColumns: ["id"];
          },
        ];
      };
      abrigos: {
        Row: {
          contato: string | null;
          created_at: string;
          created_by: string | null;
          endereco: string;
          evento_id: string;
          foto_url: string | null;
          id: string;
          nome: string;
          updated_at: string;
        };
        Insert: {
          contato?: string | null;
          created_at?: string;
          created_by?: string | null;
          endereco: string;
          evento_id: string;
          foto_url?: string | null;
          id?: string;
          nome: string;
          updated_at?: string;
        };
        Update: {
          contato?: string | null;
          created_at?: string;
          created_by?: string | null;
          endereco?: string;
          evento_id?: string;
          foto_url?: string | null;
          id?: string;
          nome?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "abrigos_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "abrigos_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "eventos";
            referencedColumns: ["id"];
          },
        ];
      };
      doacao_itens_urgentes: {
        Row: {
          created_at: string;
          created_by: string | null;
          evento_id: string;
          id: string;
          item: string;
          prioridade: Database["public"]["Enums"]["prioridade_enum"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          evento_id: string;
          id?: string;
          item: string;
          prioridade?: Database["public"]["Enums"]["prioridade_enum"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          evento_id?: string;
          id?: string;
          item?: string;
          prioridade?: Database["public"]["Enums"]["prioridade_enum"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "doacao_itens_urgentes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "doacao_itens_urgentes_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "eventos";
            referencedColumns: ["id"];
          },
        ];
      };
      eventos: {
        Row: {
          created_at: string;
          criado_por: string | null;
          data_fim: string | null;
          data_inicio: string;
          descricao: string | null;
          estado: string;
          id: string;
          latitude: number | null;
          localidade: string;
          longitude: number | null;
          nome: string;
          slug: string;
          status: Database["public"]["Enums"]["evento_status_enum"];
          tipo: Database["public"]["Enums"]["evento_tipo_enum"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          criado_por?: string | null;
          data_fim?: string | null;
          data_inicio?: string;
          descricao?: string | null;
          estado: string;
          id?: string;
          latitude?: number | null;
          localidade: string;
          longitude?: number | null;
          nome: string;
          slug: string;
          status?: Database["public"]["Enums"]["evento_status_enum"];
          tipo?: Database["public"]["Enums"]["evento_tipo_enum"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          criado_por?: string | null;
          data_fim?: string | null;
          data_inicio?: string;
          descricao?: string | null;
          estado?: string;
          id?: string;
          latitude?: number | null;
          localidade?: string;
          longitude?: number | null;
          nome?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["evento_status_enum"];
          tipo?: Database["public"]["Enums"]["evento_tipo_enum"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "eventos_criado_por_fkey";
            columns: ["criado_por"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      locais_doacao: {
        Row: {
          contato: string | null;
          created_at: string;
          created_by: string | null;
          endereco: string;
          evento_id: string;
          foto_url: string | null;
          id: string;
          nome: string;
          updated_at: string;
        };
        Insert: {
          contato?: string | null;
          created_at?: string;
          created_by?: string | null;
          endereco: string;
          evento_id: string;
          foto_url?: string | null;
          id?: string;
          nome: string;
          updated_at?: string;
        };
        Update: {
          contato?: string | null;
          created_at?: string;
          created_by?: string | null;
          endereco?: string;
          evento_id?: string;
          foto_url?: string | null;
          id?: string;
          nome?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "locais_doacao_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "locais_doacao_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "eventos";
            referencedColumns: ["id"];
          },
        ];
      };
      noticias: {
        Row: {
          created_at: string;
          created_by: string | null;
          evento_id: string;
          fonte: string | null;
          id: string;
          publicado_em: string;
          tag: Database["public"]["Enums"]["noticia_tag_enum"];
          texto: string;
          titulo: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          evento_id: string;
          fonte?: string | null;
          id?: string;
          publicado_em?: string;
          tag: Database["public"]["Enums"]["noticia_tag_enum"];
          texto: string;
          titulo: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          evento_id?: string;
          fonte?: string | null;
          id?: string;
          publicado_em?: string;
          tag?: Database["public"]["Enums"]["noticia_tag_enum"];
          texto?: string;
          titulo?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "noticias_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "noticias_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "eventos";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          role: Database["public"]["Enums"]["user_role_enum"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          id: string;
          name: string;
          role?: Database["public"]["Enums"]["user_role_enum"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          role?: Database["public"]["Enums"]["user_role_enum"];
          updated_at?: string;
        };
        Relationships: [];
      };
      vias_interditadas: {
        Row: {
          ativa: boolean;
          created_at: string;
          created_by: string | null;
          endereco: string;
          evento_id: string;
          google_maps_place_id: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          motivo: string | null;
          updated_at: string;
        };
        Insert: {
          ativa?: boolean;
          created_at?: string;
          created_by?: string | null;
          endereco: string;
          evento_id: string;
          google_maps_place_id?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          motivo?: string | null;
          updated_at?: string;
        };
        Update: {
          ativa?: boolean;
          created_at?: string;
          created_by?: string | null;
          endereco?: string;
          evento_id?: string;
          google_maps_place_id?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          motivo?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vias_interditadas_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vias_interditadas_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "eventos";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      abrigos_com_contagem: {
        Row: {
          contato: string | null;
          created_at: string | null;
          created_by: string | null;
          endereco: string | null;
          evento_id: string | null;
          foto_url: string | null;
          id: string | null;
          nome: string | null;
          total_desabrigados: number | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "abrigos_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "abrigos_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "eventos";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      slugify: { Args: { "": string }; Returns: string };
    };
    Enums: {
      evento_status_enum: "ativo" | "encerrado" | "monitoramento";
      evento_tipo_enum:
        | "enchente"
        | "ciclone"
        | "incendio"
        | "seca"
        | "deslizamento"
        | "terremoto"
        | "outro";
      noticia_tag_enum:
        | "alerta"
        | "informativo"
        | "boas_noticias"
        | "transito"
        | "previsao_tempo";
      prioridade_enum: "alta" | "media" | "baixa";
      user_role_enum: "user" | "volunteer" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      evento_status_enum: ["ativo", "encerrado", "monitoramento"],
      evento_tipo_enum: [
        "enchente",
        "ciclone",
        "incendio",
        "seca",
        "deslizamento",
        "terremoto",
        "outro",
      ],
      noticia_tag_enum: [
        "alerta",
        "informativo",
        "boas_noticias",
        "transito",
        "previsao_tempo",
      ],
      prioridade_enum: ["alta", "media", "baixa"],
      user_role_enum: ["user", "volunteer", "admin"],
    },
  },
} as const;
