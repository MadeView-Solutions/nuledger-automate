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
      field_mappings: {
        Row: {
          created_at: string
          data_type: string
          filevine_field: string
          id: string
          is_required: boolean
          mapping_status: string
          nuledger_field: string
          preset_name: string | null
          transformation_rule: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type?: string
          filevine_field: string
          id?: string
          is_required?: boolean
          mapping_status?: string
          nuledger_field: string
          preset_name?: string | null
          transformation_rule?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string
          filevine_field?: string
          id?: string
          is_required?: boolean
          mapping_status?: string
          nuledger_field?: string
          preset_name?: string | null
          transformation_rule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      migration_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          data_categories: string[]
          date_range_end: string | null
          date_range_start: string | null
          error_logs: Json | null
          id: string
          job_type: string
          records_failed: number | null
          records_skipped: number | null
          records_success: number | null
          records_total: number | null
          skip_reasons: Json | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_categories?: string[]
          date_range_end?: string | null
          date_range_start?: string | null
          error_logs?: Json | null
          id?: string
          job_type: string
          records_failed?: number | null
          records_skipped?: number | null
          records_success?: number | null
          records_total?: number | null
          skip_reasons?: Json | null
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_categories?: string[]
          date_range_end?: string | null
          date_range_start?: string | null
          error_logs?: Json | null
          id?: string
          job_type?: string
          records_failed?: number | null
          records_skipped?: number | null
          records_success?: number | null
          records_total?: number | null
          skip_reasons?: Json | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      migration_records: {
        Row: {
          created_at: string
          error_message: string | null
          filevine_id: string
          id: string
          migration_job_id: string
          nuledger_id: string | null
          record_type: string
          skip_reason: string | null
          source_data: Json
          status: string
          transformed_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          filevine_id: string
          id?: string
          migration_job_id: string
          nuledger_id?: string | null
          record_type: string
          skip_reason?: string | null
          source_data: Json
          status?: string
          transformed_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          filevine_id?: string
          id?: string
          migration_job_id?: string
          nuledger_id?: string | null
          record_type?: string
          skip_reason?: string | null
          source_data?: Json
          status?: string
          transformed_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_records_migration_job_id_fkey"
            columns: ["migration_job_id"]
            isOneToOne: false
            referencedRelation: "migration_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_config: {
        Row: {
          auto_sync_enabled: boolean
          created_at: string
          filevine_org_id: string | null
          filevine_user_id: string | null
          id: string
          last_sync_at: string | null
          sync_frequency: string
          updated_at: string
        }
        Insert: {
          auto_sync_enabled?: boolean
          created_at?: string
          filevine_org_id?: string | null
          filevine_user_id?: string | null
          id?: string
          last_sync_at?: string | null
          sync_frequency?: string
          updated_at?: string
        }
        Update: {
          auto_sync_enabled?: boolean
          created_at?: string
          filevine_org_id?: string | null
          filevine_user_id?: string | null
          id?: string
          last_sync_at?: string | null
          sync_frequency?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
