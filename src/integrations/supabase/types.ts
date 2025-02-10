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
      forecast_data: {
        Row: {
          category: string | null
          channel: string | null
          city: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          region: string | null
          sku: string | null
          subcategory: string | null
          updated_at: string
          value: number
          warehouse: string | null
        }
        Insert: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          region?: string | null
          sku?: string | null
          subcategory?: string | null
          updated_at?: string
          value: number
          warehouse?: string | null
        }
        Update: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          region?: string | null
          sku?: string | null
          subcategory?: string | null
          updated_at?: string
          value?: number
          warehouse?: string | null
        }
        Relationships: []
      }
      inventory_data: {
        Row: {
          category: string | null
          channel: string | null
          city: string | null
          created_at: string
          current_stock: number
          id: string
          location: string | null
          max_stock: number
          min_stock: number
          name: string
          notes: string | null
          product_family: string | null
          region: string | null
          sku: string
          subcategory: string | null
          updated_at: string
          warehouse: string | null
        }
        Insert: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          current_stock: number
          id?: string
          location?: string | null
          max_stock: number
          min_stock: number
          name: string
          notes?: string | null
          product_family?: string | null
          region?: string | null
          sku: string
          subcategory?: string | null
          updated_at?: string
          warehouse?: string | null
        }
        Update: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          current_stock?: number
          id?: string
          location?: string | null
          max_stock?: number
          min_stock?: number
          name?: string
          notes?: string | null
          product_family?: string | null
          region?: string | null
          sku?: string
          subcategory?: string | null
          updated_at?: string
          warehouse?: string | null
        }
        Relationships: []
      }
      market_events: {
        Row: {
          category: string
          created_at: string | null
          date: string
          description: string
          id: string
          impact: number
          name: string
          source: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          date: string
          description?: string
          id?: string
          impact: number
          name: string
          source?: string | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          impact?: number
          name?: string
          source?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      marketing_data: {
        Row: {
          budget: number
          campaign_name: string
          channel: string | null
          city: string | null
          created_at: string
          end_date: string
          expected_roi: number | null
          id: string
          kpis: string | null
          notes: string | null
          product_category: string | null
          region: string | null
          start_date: string
          target_audience: string
          updated_at: string
        }
        Insert: {
          budget: number
          campaign_name: string
          channel?: string | null
          city?: string | null
          created_at?: string
          end_date: string
          expected_roi?: number | null
          id?: string
          kpis?: string | null
          notes?: string | null
          product_category?: string | null
          region?: string | null
          start_date: string
          target_audience: string
          updated_at?: string
        }
        Update: {
          budget?: number
          campaign_name?: string
          channel?: string | null
          city?: string | null
          created_at?: string
          end_date?: string
          expected_roi?: number | null
          id?: string
          kpis?: string | null
          notes?: string | null
          product_category?: string | null
          region?: string | null
          start_date?: string
          target_audience?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_settings: {
        Row: {
          created_at: string
          data_template: Json | null
          id: string
          module: Database["public"]["Enums"]["module_type"]
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_template?: Json | null
          id?: string
          module: Database["public"]["Enums"]["module_type"]
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_template?: Json | null
          id?: string
          module?: Database["public"]["Enums"]["module_type"]
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      sales_data: {
        Row: {
          category: string | null
          channel: string | null
          city: string | null
          created_at: string
          customer: string | null
          date: string
          id: string
          notes: string | null
          payment_method: string | null
          price: number
          quantity: number
          region: string | null
          sku: string
          subcategory: string | null
          total: number
          updated_at: string
          warehouse: string | null
        }
        Insert: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          customer?: string | null
          date: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          price: number
          quantity: number
          region?: string | null
          sku: string
          subcategory?: string | null
          total: number
          updated_at?: string
          warehouse?: string | null
        }
        Update: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          customer?: string | null
          date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          price?: number
          quantity?: number
          region?: string | null
          sku?: string
          subcategory?: string | null
          total?: number
          updated_at?: string
          warehouse?: string | null
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
      module_type:
        | "forecasting"
        | "inventory"
        | "sales"
        | "marketing"
        | "logistics"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
