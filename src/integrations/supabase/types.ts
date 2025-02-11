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
      data_quality_metrics: {
        Row: {
          accuracy_score: number | null
          anomaly_count: number | null
          completeness_score: number | null
          consistency_score: number | null
          created_at: string | null
          dataset_date: string
          id: string
          notes: string | null
        }
        Insert: {
          accuracy_score?: number | null
          anomaly_count?: number | null
          completeness_score?: number | null
          consistency_score?: number | null
          created_at?: string | null
          dataset_date: string
          id?: string
          notes?: string | null
        }
        Update: {
          accuracy_score?: number | null
          anomaly_count?: number | null
          completeness_score?: number | null
          consistency_score?: number | null
          created_at?: string | null
          dataset_date?: string
          id?: string
          notes?: string | null
        }
        Relationships: []
      }
      data_validation_logs: {
        Row: {
          created_at: string | null
          error_count: number
          file_name: string
          id: string
          module: Database["public"]["Enums"]["module_type"]
          processed_by: string | null
          row_count: number
          status: string
          updated_at: string | null
          validation_date: string | null
          validation_errors: Json | null
        }
        Insert: {
          created_at?: string | null
          error_count?: number
          file_name: string
          id?: string
          module: Database["public"]["Enums"]["module_type"]
          processed_by?: string | null
          row_count: number
          status?: string
          updated_at?: string | null
          validation_date?: string | null
          validation_errors?: Json | null
        }
        Update: {
          created_at?: string | null
          error_count?: number
          file_name?: string
          id?: string
          module?: Database["public"]["Enums"]["module_type"]
          processed_by?: string | null
          row_count?: number
          status?: string
          updated_at?: string | null
          validation_date?: string | null
          validation_errors?: Json | null
        }
        Relationships: []
      }
      forecast_accuracy: {
        Row: {
          actual_value: number | null
          created_at: string | null
          forecast_date: string
          forecasted_value: number | null
          id: string
          mae: number | null
          mape: number | null
          model_id: string | null
          notes: string | null
          rmse: number | null
          updated_at: string | null
        }
        Insert: {
          actual_value?: number | null
          created_at?: string | null
          forecast_date: string
          forecasted_value?: number | null
          id?: string
          mae?: number | null
          mape?: number | null
          model_id?: string | null
          notes?: string | null
          rmse?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_value?: number | null
          created_at?: string | null
          forecast_date?: string
          forecasted_value?: number | null
          id?: string
          mae?: number | null
          mape?: number | null
          model_id?: string | null
          notes?: string | null
          rmse?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forecast_accuracy_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "forecast_models"
            referencedColumns: ["id"]
          },
        ]
      }
      forecast_adjustments: {
        Row: {
          adjusted_at: string | null
          adjusted_by: string | null
          adjustment_reason: string | null
          forecast_id: string | null
          id: string
          metadata: Json | null
          new_value: number | null
          previous_value: number | null
        }
        Insert: {
          adjusted_at?: string | null
          adjusted_by?: string | null
          adjustment_reason?: string | null
          forecast_id?: string | null
          id?: string
          metadata?: Json | null
          new_value?: number | null
          previous_value?: number | null
        }
        Update: {
          adjusted_at?: string | null
          adjusted_by?: string | null
          adjustment_reason?: string | null
          forecast_id?: string | null
          id?: string
          metadata?: Json | null
          new_value?: number | null
          previous_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forecast_adjustments_forecast_id_fkey"
            columns: ["forecast_id"]
            isOneToOne: false
            referencedRelation: "forecast_data"
            referencedColumns: ["id"]
          },
        ]
      }
      forecast_data: {
        Row: {
          category: string | null
          channel: string | null
          city: string | null
          created_at: string
          date: string
          forecast: number | null
          id: string
          notes: string | null
          region: string | null
          sku: string | null
          subcategory: string | null
          updated_at: string
          value: number
          variance: number | null
          warehouse: string | null
        }
        Insert: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          date: string
          forecast?: number | null
          id?: string
          notes?: string | null
          region?: string | null
          sku?: string | null
          subcategory?: string | null
          updated_at?: string
          value: number
          variance?: number | null
          warehouse?: string | null
        }
        Update: {
          category?: string | null
          channel?: string | null
          city?: string | null
          created_at?: string
          date?: string
          forecast?: number | null
          id?: string
          notes?: string | null
          region?: string | null
          sku?: string | null
          subcategory?: string | null
          updated_at?: string
          value?: number
          variance?: number | null
          warehouse?: string | null
        }
        Relationships: []
      }
      forecast_data_quality: {
        Row: {
          created_at: string | null
          data_completeness_score: number | null
          dataset_date: string
          id: string
          missing_values_count: number | null
          outliers_count: number | null
          quality_issues: Json | null
          resolution_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_completeness_score?: number | null
          dataset_date: string
          id?: string
          missing_values_count?: number | null
          outliers_count?: number | null
          quality_issues?: Json | null
          resolution_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_completeness_score?: number | null
          dataset_date?: string
          id?: string
          missing_values_count?: number | null
          outliers_count?: number | null
          quality_issues?: Json | null
          resolution_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      forecast_models: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          last_modified_by: string | null
          name: string
          parameters: Json
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_by?: string | null
          name: string
          parameters?: Json
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_by?: string | null
          name?: string
          parameters?: Json
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      forecast_outliers: {
        Row: {
          confidence_score: number | null
          data_point_id: string | null
          detected_at: string | null
          detection_method: string
          id: string
          is_verified: boolean | null
          metadata: Json | null
          verified_by: string | null
        }
        Insert: {
          confidence_score?: number | null
          data_point_id?: string | null
          detected_at?: string | null
          detection_method: string
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          verified_by?: string | null
        }
        Update: {
          confidence_score?: number | null
          data_point_id?: string | null
          detected_at?: string | null
          detection_method?: string
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forecast_outliers_data_point_id_fkey"
            columns: ["data_point_id"]
            isOneToOne: false
            referencedRelation: "forecast_data"
            referencedColumns: ["id"]
          },
        ]
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
      logistics_data: {
        Row: {
          actual_delivery: string | null
          carrier: string
          cost: number | null
          created_at: string
          date: string
          destination: string
          estimated_delivery: string | null
          id: string
          notes: string | null
          origin: string
          priority: string | null
          shipment_id: string
          status: string
          tracking_number: string | null
          type: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          actual_delivery?: string | null
          carrier: string
          cost?: number | null
          created_at?: string
          date: string
          destination: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          origin: string
          priority?: string | null
          shipment_id: string
          status: string
          tracking_number?: string | null
          type?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          actual_delivery?: string | null
          carrier?: string
          cost?: number | null
          created_at?: string
          date?: string
          destination?: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          origin?: string
          priority?: string | null
          shipment_id?: string
          status?: string
          tracking_number?: string | null
          type?: string | null
          updated_at?: string
          weight?: number | null
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
      model_versions: {
        Row: {
          accuracy_metrics: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          model_name: string
          parameters: Json | null
          training_data_snapshot: Json | null
          updated_at: string | null
          validation_metrics: Json | null
          version: string
        }
        Insert: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          model_name: string
          parameters?: Json | null
          training_data_snapshot?: Json | null
          updated_at?: string | null
          validation_metrics?: Json | null
          version: string
        }
        Update: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          model_name?: string
          parameters?: Json | null
          training_data_snapshot?: Json | null
          updated_at?: string | null
          validation_metrics?: Json | null
          version?: string
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
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          data_template?: Json | null
          id?: string
          module: Database["public"]["Enums"]["module_type"]
          settings?: Json | null
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          data_template?: Json | null
          id?: string
          module?: Database["public"]["Enums"]["module_type"]
          settings?: Json | null
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: []
      }
      price_analysis: {
        Row: {
          analysis_date: string | null
          id: string
          max_threshold: number | null
          min_threshold: number | null
          optimal_price: number | null
          optimal_threshold: number | null
          price_elasticity: number | null
          product_id: string | null
        }
        Insert: {
          analysis_date?: string | null
          id?: string
          max_threshold?: number | null
          min_threshold?: number | null
          optimal_price?: number | null
          optimal_threshold?: number | null
          price_elasticity?: number | null
          product_id?: string | null
        }
        Update: {
          analysis_date?: string | null
          id?: string
          max_threshold?: number | null
          min_threshold?: number | null
          optimal_price?: number | null
          optimal_threshold?: number | null
          price_elasticity?: number | null
          product_id?: string | null
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
      scenarios: {
        Row: {
          created_at: string | null
          forecast_data: Json | null
          horizon: string
          id: string
          model: string
          name: string
          parameters: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          forecast_data?: Json | null
          horizon: string
          id?: string
          model: string
          name: string
          parameters?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          forecast_data?: Json | null
          horizon?: string
          id?: string
          model?: string
          name?: string
          parameters?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seasonality_patterns: {
        Row: {
          configuration: Json | null
          dataset_id: string | null
          detected_at: string | null
          frequency: number | null
          id: string
          last_updated_at: string | null
          metadata: Json | null
          pattern_type: string
          strength: number | null
        }
        Insert: {
          configuration?: Json | null
          dataset_id?: string | null
          detected_at?: string | null
          frequency?: number | null
          id?: string
          last_updated_at?: string | null
          metadata?: Json | null
          pattern_type: string
          strength?: number | null
        }
        Update: {
          configuration?: Json | null
          dataset_id?: string | null
          detected_at?: string | null
          frequency?: number | null
          id?: string
          last_updated_at?: string | null
          metadata?: Json | null
          pattern_type?: string
          strength?: number | null
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          alert: string | null
          humidity: number | null
          id: string
          location: string
          precipitation: number | null
          recorded_at: string | null
          temperature: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          alert?: string | null
          humidity?: number | null
          id?: string
          location: string
          precipitation?: number | null
          recorded_at?: string | null
          temperature?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          alert?: string | null
          humidity?: number | null
          id?: string
          location?: string
          precipitation?: number | null
          recorded_at?: string | null
          temperature?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
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
        | "location_hierarchy"
        | "product_hierarchy"
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
