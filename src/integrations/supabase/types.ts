export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          address: string
          application_pdf_url: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          email: string
          employer: string | null
          estate_id: string
          first_name: string
          id: string
          last_name: string
          monthly_income: number | null
          next_of_kin_address: string
          next_of_kin_name: string
          next_of_kin_phone: string
          next_of_kin_relationship: string
          occupation: string | null
          payment_plan: Database["public"]["Enums"]["payment_plan_type"]
          phone: string
          property_id: string
          rejection_reason: string | null
          selected_house: string | null
          selected_street: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          application_pdf_url?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          email: string
          employer?: string | null
          estate_id: string
          first_name: string
          id?: string
          last_name: string
          monthly_income?: number | null
          next_of_kin_address: string
          next_of_kin_name: string
          next_of_kin_phone: string
          next_of_kin_relationship: string
          occupation?: string | null
          payment_plan: Database["public"]["Enums"]["payment_plan_type"]
          phone: string
          property_id: string
          rejection_reason?: string | null
          selected_house?: string | null
          selected_street?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          application_pdf_url?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          email?: string
          employer?: string | null
          estate_id?: string
          first_name?: string
          id?: string
          last_name?: string
          monthly_income?: number | null
          next_of_kin_address?: string
          next_of_kin_name?: string
          next_of_kin_phone?: string
          next_of_kin_relationship?: string
          occupation?: string | null
          payment_plan?: Database["public"]["Enums"]["payment_plan_type"]
          phone?: string
          property_id?: string
          rejection_reason?: string | null
          selected_house?: string | null
          selected_street?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          template_content: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template_content: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_content?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          application_id: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          application_id?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          application_id?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          id: string
          recipient_email: string
          sent_at: string | null
          status: string | null
          subject: string
          template_name: string | null
        }
        Insert: {
          id?: string
          recipient_email: string
          sent_at?: string | null
          status?: string | null
          subject: string
          template_name?: string | null
        }
        Update: {
          id?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_name?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
      }
      estates: {
        Row: {
          account_name: string
          account_number: string
          available_units: number | null
          bank_name: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          name: string
          sold_units: number | null
          total_units: number | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          available_units?: number | null
          bank_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          name: string
          sold_units?: number | null
          total_units?: number | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          available_units?: number | null
          bank_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          name?: string
          sold_units?: number | null
          total_units?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      generated_documents: {
        Row: {
          application_id: string
          document_type: string
          document_url: string
          generated_at: string | null
          id: string
          payment_percentage: number
        }
        Insert: {
          application_id: string
          document_type: string
          document_url: string
          generated_at?: string | null
          id?: string
          payment_percentage?: number
        }
        Update: {
          application_id?: string
          document_type?: string
          document_url?: string
          generated_at?: string | null
          id?: string
          payment_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_schedules: {
        Row: {
          amount: number
          application_id: string
          created_at: string | null
          due_date: string
          id: string
          installment_number: number
          paid_at: string | null
          payment_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          application_id: string
          created_at?: string | null
          due_date: string
          id?: string
          installment_number: number
          paid_at?: string | null
          payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          application_id?: string
          created_at?: string | null
          due_date?: string
          id?: string
          installment_number?: number
          paid_at?: string | null
          payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_schedules_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_schedules_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          application_id: string
          created_at: string | null
          id: string
          installment_number: number | null
          notes: string | null
          payment_method: string | null
          payment_reference: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          total_installments: number | null
          transaction_date: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          application_id: string
          created_at?: string | null
          id?: string
          installment_number?: number | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          total_installments?: number | null
          transaction_date?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          application_id?: string
          created_at?: string | null
          id?: string
          installment_number?: number | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          total_installments?: number | null
          transaction_date?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          estate_id: string
          id: string
          images: string[] | null
          is_featured: boolean | null
          lot_size: string | null
          payment_plans:
            | Database["public"]["Enums"]["payment_plan_type"][]
            | null
          price: number
          property_type: string | null
          square_feet: number | null
          status: Database["public"]["Enums"]["property_status"] | null
          street_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          estate_id: string
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          lot_size?: string | null
          payment_plans?:
            | Database["public"]["Enums"]["payment_plan_type"][]
            | null
          price: number
          property_type?: string | null
          square_feet?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          street_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          estate_id?: string
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          lot_size?: string | null
          payment_plans?:
            | Database["public"]["Enums"]["payment_plan_type"][]
            | null
          price?: number
          property_type?: string | null
          square_feet?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          street_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_street_id_fkey"
            columns: ["street_id"]
            isOneToOne: false
            referencedRelation: "streets"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount: number
          id: string
          issued_by: string | null
          issued_date: string | null
          payment_id: string
          pdf_url: string | null
          receipt_number: string
        }
        Insert: {
          amount: number
          id?: string
          issued_by?: string | null
          issued_date?: string | null
          payment_id: string
          pdf_url?: string | null
          receipt_number: string
        }
        Update: {
          amount?: number
          id?: string
          issued_by?: string | null
          issued_date?: string | null
          payment_id?: string
          pdf_url?: string | null
          receipt_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      streets: {
        Row: {
          created_at: string | null
          description: string | null
          estate_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estate_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estate_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "streets_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_profile_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "completed"
      document_type: "passport" | "id_card" | "receipt" | "contract" | "other"
      payment_plan_type:
        | "outright"
        | "musharakah"
        | "murabahah"
        | "ijarah"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      property_status: "available" | "reserved" | "sold" | "under_construction"
      user_role: "admin" | "agent" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "completed",
      ],
      document_type: ["passport", "id_card", "receipt", "contract", "other"],
      payment_plan_type: [
        "outright",
        "musharakah",
        "murabahah",
        "ijarah",
      ],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      property_status: ["available", "reserved", "sold", "under_construction"],
      user_role: ["admin", "agent", "client"],
    },
  },
} as const
