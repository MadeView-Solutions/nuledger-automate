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
      account_templates: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          name: string
          parent_code: string | null
          practice_area: string
          type: Database["public"]["Enums"]["account_type"]
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          parent_code?: string | null
          practice_area: string
          type: Database["public"]["Enums"]["account_type"]
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          parent_code?: string | null
          practice_area?: string
          type?: Database["public"]["Enums"]["account_type"]
        }
        Relationships: []
      }
      accounts: {
        Row: {
          code: string
          created_at: string
          currency: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          parent_id: string | null
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          parent_id?: string | null
          type: Database["public"]["Enums"]["account_type"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          parent_id?: string | null
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "mv_gl_detail"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "mv_trial_balance"
            referencedColumns: ["account_id"]
          },
        ]
      }
      ai_rules: {
        Row: {
          action_jsonb: Json
          created_at: string
          id: string
          is_active: boolean | null
          match_jsonb: Json
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          action_jsonb: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          match_jsonb: Json
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          action_jsonb?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          match_jsonb?: Json
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "ai_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "ai_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_suggestions: {
        Row: {
          applied: boolean | null
          confidence: number | null
          created_at: string
          id: string
          organization_id: string
          suggested_account_id: string | null
          transaction_id: string
        }
        Insert: {
          applied?: boolean | null
          confidence?: number | null
          created_at?: string
          id?: string
          organization_id: string
          suggested_account_id?: string | null
          transaction_id: string
        }
        Update: {
          applied?: boolean | null
          confidence?: number | null
          created_at?: string
          id?: string
          organization_id?: string
          suggested_account_id?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "ai_suggestions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "ai_suggestions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_suggestions_suggested_account_id_fkey"
            columns: ["suggested_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_suggestions_suggested_account_id_fkey"
            columns: ["suggested_account_id"]
            isOneToOne: false
            referencedRelation: "mv_gl_detail"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "ai_suggestions_suggested_account_id_fkey"
            columns: ["suggested_account_id"]
            isOneToOne: false
            referencedRelation: "mv_trial_balance"
            referencedColumns: ["account_id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_id: string | null
          created_at: string
          id: string
          institution: string | null
          last4: string | null
          name: string
          organization_id: string
          type: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          last4?: string | null
          name: string
          organization_id: string
          type: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          last4?: string | null
          name?: string
          organization_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mv_gl_detail"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "bank_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mv_trial_balance"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "bank_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_feeds: {
        Row: {
          access_token: string | null
          bank_account_id: string | null
          created_at: string
          id: string
          last_sync: string | null
          organization_id: string
          provider: Database["public"]["Enums"]["bank_feed_provider"]
          status: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          bank_account_id?: string | null
          created_at?: string
          id?: string
          last_sync?: string | null
          organization_id: string
          provider: Database["public"]["Enums"]["bank_feed_provider"]
          status?: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          bank_account_id?: string | null
          created_at?: string
          id?: string
          last_sync?: string | null
          organization_id?: string
          provider?: Database["public"]["Enums"]["bank_feed_provider"]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_feeds_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_feeds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_feeds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_feeds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_account_id: string | null
          created_at: string
          date: string
          description: string | null
          external_id: string | null
          id: string
          matched_entry_id: string | null
          organization_id: string
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          external_id?: string | null
          id?: string
          matched_entry_id?: string | null
          organization_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          external_id?: string | null
          id?: string
          matched_entry_id?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_entry_id_fkey"
            columns: ["matched_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_entry_id_fkey"
            columns: ["matched_entry_id"]
            isOneToOne: false
            referencedRelation: "v_uncleared_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      case_accounts: {
        Row: {
          case_id: string
          created_at: string
          id: string
          operating_account_id: string | null
          trust_account_id: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          operating_account_id?: string | null
          trust_account_id?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          operating_account_id?: string | null
          trust_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_accounts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: true
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_accounts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: true
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "case_accounts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: true
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "case_accounts_operating_account_id_fkey"
            columns: ["operating_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_accounts_operating_account_id_fkey"
            columns: ["operating_account_id"]
            isOneToOne: false
            referencedRelation: "mv_gl_detail"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "case_accounts_operating_account_id_fkey"
            columns: ["operating_account_id"]
            isOneToOne: false
            referencedRelation: "mv_trial_balance"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "case_accounts_trust_account_id_fkey"
            columns: ["trust_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_accounts_trust_account_id_fkey"
            columns: ["trust_account_id"]
            isOneToOne: false
            referencedRelation: "mv_gl_detail"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "case_accounts_trust_account_id_fkey"
            columns: ["trust_account_id"]
            isOneToOne: false
            referencedRelation: "mv_trial_balance"
            referencedColumns: ["account_id"]
          },
        ]
      }
      cases: {
        Row: {
          case_no: string
          client_id: string
          created_at: string
          id: string
          opened_on: string
          organization_id: string
          practice_area: string | null
          settled_on: string | null
          status: string
          updated_at: string
        }
        Insert: {
          case_no: string
          client_id: string
          created_at?: string
          id?: string
          opened_on?: string
          organization_id: string
          practice_area?: string | null
          settled_on?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          case_no?: string
          client_id?: string
          created_at?: string
          id?: string
          opened_on?: string
          organization_id?: string
          practice_area?: string | null
          settled_on?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      checks: {
        Row: {
          amount: number
          attachment_url: string | null
          bank_account_id: string | null
          created_at: string
          date: string
          id: string
          memo: string | null
          number: string | null
          organization_id: string
          payee: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          attachment_url?: string | null
          bank_account_id?: string | null
          created_at?: string
          date: string
          id?: string
          memo?: string | null
          number?: string | null
          organization_id: string
          payee: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          bank_account_id?: string | null
          created_at?: string
          date?: string
          id?: string
          memo?: string | null
          number?: string | null
          organization_id?: string
          payee?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checks_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "checks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "checks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      disbursement_template_lines: {
        Row: {
          account_id: string | null
          created_at: string
          fixed_amount: number | null
          id: string
          item_type: Database["public"]["Enums"]["settlement_item_type"]
          label: string
          pct: number | null
          template_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          fixed_amount?: number | null
          id?: string
          item_type: Database["public"]["Enums"]["settlement_item_type"]
          label: string
          pct?: number | null
          template_id: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          fixed_amount?: number | null
          id?: string
          item_type?: Database["public"]["Enums"]["settlement_item_type"]
          label?: string
          pct?: number | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disbursement_template_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disbursement_template_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mv_gl_detail"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "disbursement_template_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mv_trial_balance"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "disbursement_template_lines_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "disbursement_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      disbursement_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disbursement_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "disbursement_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "disbursement_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          case_id: string | null
          category: string | null
          created_at: string
          date: string
          id: string
          memo: string | null
          organization_id: string
          reimbursable: boolean | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          amount: number
          case_id?: string | null
          category?: string | null
          created_at?: string
          date: string
          id?: string
          memo?: string | null
          organization_id: string
          reimbursable?: boolean | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          case_id?: string | null
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          memo?: string | null
          organization_id?: string
          reimbursable?: boolean | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "expenses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      import_maps: {
        Row: {
          column_map: Json
          created_at: string
          id: string
          organization_id: string
          source: string
          updated_at: string
        }
        Insert: {
          column_map?: Json
          created_at?: string
          id?: string
          organization_id: string
          source: string
          updated_at?: string
        }
        Update: {
          column_map?: Json
          created_at?: string
          id?: string
          organization_id?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      imports: {
        Row: {
          created_at: string
          created_by: string | null
          file_url: string | null
          id: string
          log: string | null
          organization_id: string
          records_failed: number | null
          records_success: number | null
          records_total: number | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          log?: string | null
          organization_id: string
          records_failed?: number | null
          records_success?: number | null
          records_total?: number | null
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          log?: string | null
          organization_id?: string
          records_failed?: number | null
          records_success?: number | null
          records_total?: number | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          case_id: string | null
          created_at: string
          created_by: string
          entry_date: string
          id: string
          memo: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          created_by: string
          entry_date: string
          id?: string
          memo?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          created_by?: string
          entry_date?: string
          id?: string
          memo?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "journal_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "journal_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "journal_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "journal_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_lines: {
        Row: {
          account_id: string
          credit: number
          debit: number
          entry_id: string
          id: string
        }
        Insert: {
          account_id: string
          credit?: number
          debit?: number
          entry_id: string
          id?: string
        }
        Update: {
          account_id?: string
          credit?: number
          debit?: number
          entry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mv_gl_detail"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "journal_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mv_trial_balance"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "journal_lines_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_lines_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "v_uncleared_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis_daily: {
        Row: {
          ap: number
          ar: number
          cases_open: number
          date: string
          op_balance: number
          organization_id: string
          settled_this_month: number
          trust_balance: number
          updated_at: string
          utilization: number
          write_offs: number
        }
        Insert: {
          ap?: number
          ar?: number
          cases_open?: number
          date: string
          op_balance?: number
          organization_id: string
          settled_this_month?: number
          trust_balance?: number
          updated_at?: string
          utilization?: number
          write_offs?: number
        }
        Update: {
          ap?: number
          ar?: number
          cases_open?: number
          date?: string
          op_balance?: number
          organization_id?: string
          settled_this_month?: number
          trust_balance?: number
          updated_at?: string
          utilization?: number
          write_offs?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpis_daily_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "kpis_daily_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "kpis_daily_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      org_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "org_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "org_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          case_prefix: string | null
          created_at: string
          currency: string
          fiscal_start_month: number
          number_format: string
          organization_id: string
          timezone: string
          updated_at: string
        }
        Insert: {
          case_prefix?: string | null
          created_at?: string
          currency?: string
          fiscal_start_month?: number
          number_format?: string
          organization_id: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          case_prefix?: string | null
          created_at?: string
          currency?: string
          fiscal_start_month?: number
          number_format?: string
          organization_id?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reconciliations: {
        Row: {
          bank_account_id: string | null
          created_at: string
          ending_balance: number
          id: string
          organization_id: string
          statement_end: string
          statement_start: string
          status: string
          updated_at: string
        }
        Insert: {
          bank_account_id?: string | null
          created_at?: string
          ending_balance: number
          id?: string
          organization_id: string
          statement_end: string
          statement_start: string
          status?: string
          updated_at?: string
        }
        Update: {
          bank_account_id?: string | null
          created_at?: string
          ending_balance?: number
          id?: string
          organization_id?: string
          statement_end?: string
          statement_start?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reconciliations_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reconciliations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "reconciliations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "reconciliations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_items: {
        Row: {
          amount: number
          created_at: string
          id: string
          label: string
          settlement_id: string
          type: Database["public"]["Enums"]["settlement_item_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          label: string
          settlement_id: string
          type: Database["public"]["Enums"]["settlement_item_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          label?: string
          settlement_id?: string
          type?: Database["public"]["Enums"]["settlement_item_type"]
        }
        Relationships: [
          {
            foreignKeyName: "settlement_items_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "settlements"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          case_id: string
          client_net: number | null
          created_at: string
          fee_amount: number | null
          fee_pct: number | null
          gross_amount: number
          id: string
          liens_total: number | null
          organization_id: string
          received_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          case_id: string
          client_net?: number | null
          created_at?: string
          fee_amount?: number | null
          fee_pct?: number | null
          gross_amount: number
          id?: string
          liens_total?: number | null
          organization_id: string
          received_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          client_net?: number | null
          created_at?: string
          fee_amount?: number | null
          fee_pct?: number | null
          gross_amount?: number
          id?: string
          liens_total?: number | null
          organization_id?: string
          received_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "settlements_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      test_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          executed_by: string
          id: string
          log: string | null
          passed: boolean | null
          scenario_id: string
          started_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          executed_by: string
          id?: string
          log?: string | null
          passed?: boolean | null
          scenario_id: string
          started_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          executed_by?: string
          id?: string
          log?: string | null
          passed?: boolean | null
          scenario_id?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_runs_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "test_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      test_scenarios: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          seed_jsonb: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          seed_jsonb?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          seed_jsonb?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_scenarios_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "test_scenarios_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "test_scenarios_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          billable: boolean | null
          case_id: string | null
          created_at: string
          date: string
          description: string | null
          hours: number
          id: string
          organization_id: string
          rate: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billable?: boolean | null
          case_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          hours: number
          id?: string
          organization_id: string
          rate?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billable?: boolean | null
          case_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          hours?: number
          id?: string
          organization_id?: string
          rate?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "time_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_checks: {
        Row: {
          amount: number
          case_id: string | null
          check_no: string | null
          created_at: string
          date: string
          id: string
          memo: string | null
          organization_id: string
          payee: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          case_id?: string | null
          check_no?: string | null
          created_at?: string
          date: string
          id?: string
          memo?: string | null
          organization_id: string
          payee: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          case_id?: string | null
          check_no?: string | null
          created_at?: string
          date?: string
          id?: string
          memo?: string | null
          organization_id?: string
          payee?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_checks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trust_checks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "trust_checks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "trust_checks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "trust_checks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "trust_checks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_case_cycle: {
        Row: {
          avg_open_to_settle_days: number | null
          case_count: number | null
          max_days: number | null
          median_days: number | null
          min_days: number | null
          organization_id: string | null
          practice_area: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_case_profitability: {
        Row: {
          case_id: string | null
          case_no: string | null
          expenses: number | null
          net_profit: number | null
          organization_id: string | null
          period: string | null
          revenue: number | null
          time_cost: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_gl_detail: {
        Row: {
          account_id: string | null
          code: string | null
          name: string | null
          net_change: number | null
          organization_id: string | null
          period: string | null
          total_credits: number | null
          total_debits: number | null
          transaction_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_kpis_daily: {
        Row: {
          ap: number | null
          ar: number | null
          cases_open: number | null
          date: string | null
          op_balance: number | null
          organization_id: string | null
          settled_this_month: number | null
          trust_balance: number | null
          utilization: number | null
          write_offs: number | null
        }
        Relationships: []
      }
      mv_liens_recovery_rate: {
        Row: {
          avg_lien_ratio: number | null
          case_count: number | null
          organization_id: string | null
          practice_area: string | null
          total_liens: number | null
          total_settlements: number | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_perf_weekly: {
        Row: {
          active_cases: number | null
          avg_billable_rate: number | null
          billable_hours: number | null
          organization_id: string | null
          total_hours: number | null
          total_revenue: number | null
          week_start: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_referral_roi: {
        Row: {
          avg_revenue_per_case: number | null
          cases_count: number | null
          organization_id: string | null
          referral_source: string | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_settlement_distribution: {
        Row: {
          avg_client_net: number | null
          avg_fee: number | null
          avg_gross: number | null
          avg_liens: number | null
          organization_id: string | null
          practice_area: string | null
          quarter: string | null
          settlement_count: number | null
          total_client_net: number | null
          total_fees: number | null
          total_gross: number | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_trial_balance: {
        Row: {
          account_id: string | null
          as_of: string | null
          balance: number | null
          code: string | null
          name: string | null
          organization_id: string | null
          type: Database["public"]["Enums"]["account_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_trust_three_way: {
        Row: {
          as_of: string | null
          bank_balance: number | null
          client_ledger_total: number | null
          control_account: number | null
          organization_id: string | null
        }
        Relationships: []
      }
      v_case_costs: {
        Row: {
          case_id: string | null
          case_no: string | null
          organization_id: string | null
          total_cost: number | null
          total_expenses: number | null
          total_time_cost: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_realization: {
        Row: {
          billed_amount: number | null
          case_id: string | null
          collected_amount: number | null
          organization_id: string | null
          realization_rate: number | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "time_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_uncleared_entries: {
        Row: {
          case_id: string | null
          created_at: string | null
          created_by: string | null
          credit: number | null
          debit: number | null
          entry_date: string | null
          id: string | null
          memo: string | null
          organization_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "mv_case_profitability"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "journal_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_case_costs"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "journal_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "journal_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "journal_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_unmatched_bank: {
        Row: {
          amount: number | null
          bank_account_id: string | null
          bank_account_name: string | null
          created_at: string | null
          date: string | null
          description: string | null
          external_id: string | null
          id: string | null
          matched_entry_id: string | null
          organization_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_entry_id_fkey"
            columns: ["matched_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_entry_id_fkey"
            columns: ["matched_entry_id"]
            isOneToOne: false
            referencedRelation: "v_uncleared_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_utilization: {
        Row: {
          billable_hours: number | null
          organization_id: string | null
          total_hours: number | null
          user_id: string | null
          utilization_rate: number | null
          week_start: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_kpis_daily"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "mv_trust_three_way"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      fn_apply_disbursement_template: {
        Args: { _settlement_id: string; _template_id: string }
        Returns: undefined
      }
      fn_generate_report: {
        Args: { _params?: Json; _report_type: string }
        Returns: {
          report_data: Json
        }[]
      }
      fn_issue_check: { Args: { _check_id: string }; Returns: string }
      fn_match_transactions: {
        Args: { _organization_id: string }
        Returns: number
      }
      fn_post_settlement: {
        Args: { _settlement_id: string }
        Returns: undefined
      }
      fn_refresh_reports: { Args: never; Returns: undefined }
      fn_seed_scenario: { Args: { _scenario_id: string }; Returns: string }
      fn_trust_deposit: {
        Args: {
          _amount: number
          _case_id: string
          _memo: string
          _organization_id: string
        }
        Returns: string
      }
      fn_trust_withdraw: {
        Args: {
          _amount: number
          _case_id: string
          _memo: string
          _organization_id: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      refresh_kpis_daily: { Args: never; Returns: undefined }
      user_organizations: { Args: { _user_id: string }; Returns: string[] }
    }
    Enums: {
      account_type: "asset" | "liability" | "equity" | "revenue" | "expense"
      app_role: "owner" | "admin" | "staff" | "read_only"
      bank_feed_provider: "plaid" | "qbo" | "manual"
      settlement_item_type: "fee" | "lien" | "expense" | "client"
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
      account_type: ["asset", "liability", "equity", "revenue", "expense"],
      app_role: ["owner", "admin", "staff", "read_only"],
      bank_feed_provider: ["plaid", "qbo", "manual"],
      settlement_item_type: ["fee", "lien", "expense", "client"],
    },
  },
} as const
