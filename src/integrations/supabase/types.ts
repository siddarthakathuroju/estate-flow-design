export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          id: string
          job_type: string
          pay_amount: number
          property_id: string | null
          status: string
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_type: string
          pay_amount?: number
          property_id?: string | null
          status?: string
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string
          pay_amount?: number
          property_id?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone_text: string | null
          role: Database["public"]["Enums"]["user_role"]
          verified: boolean | null
          wallet_address: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone_text?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          verified?: boolean | null
          wallet_address?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone_text?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          verified?: boolean | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          created_at: string
          crypto_price: number | null
          crypto_symbol: string | null
          description: string | null
          id: string
          owner_id: string | null
          price: number
          status: string | null
          title: string
          token_id: string | null
          updated_at: string
        }
        Insert: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          created_at?: string
          crypto_price?: number | null
          crypto_symbol?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          price: number
          status?: string | null
          title: string
          token_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          area?: number
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          crypto_price?: number | null
          crypto_symbol?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          price?: number
          status?: string | null
          title?: string
          token_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      property_documents: {
        Row: {
          added_by: string | null
          created_at: string
          description: string | null
          document_type: string
          id: string
          ipfs_hash: string
          name: string
          property_id: string
          size: number | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          description?: string | null
          document_type: string
          id?: string
          ipfs_hash: string
          name: string
          property_id: string
          size?: number | null
        }
        Update: {
          added_by?: string | null
          created_at?: string
          description?: string | null
          document_type?: string
          id?: string
          ipfs_hash?: string
          name?: string
          property_id?: string
          size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          ipfs_hash: string | null
          is_primary: boolean | null
          property_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          ipfs_hash?: string | null
          is_primary?: boolean | null
          property_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          ipfs_hash?: string | null
          is_primary?: boolean | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tokenized_properties: {
        Row: {
          "id (UUID": string | null
          "primary key)": string | null
        }
        Insert: {
          "id (UUID"?: string | null
          "primary key)"?: string | null
        }
        Update: {
          "id (UUID"?: string | null
          "primary key)"?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          crypto_symbol: string | null
          date: string
          id: string
          property_id: string
          status: string
          transaction_hash: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          crypto_symbol?: string | null
          date?: string
          id?: string
          property_id: string
          status: string
          transaction_hash?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          crypto_symbol?: string | null
          date?: string
          id?: string
          property_id?: string
          status?: string
          transaction_hash?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "manager" | "worker" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["manager", "worker", "client"],
    },
  },
} as const
