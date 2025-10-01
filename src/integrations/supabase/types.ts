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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      active_models: {
        Row: {
          created_at: string | null
          id: string
          is_running: boolean | null
          last_run: string | null
          model_id: string
          model_name: string
          model_parameters: Json | null
          product_filters: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_running?: boolean | null
          last_run?: string | null
          model_id: string
          model_name: string
          model_parameters?: Json | null
          product_filters?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_running?: boolean | null
          last_run?: string | null
          model_id?: string
          model_name?: string
          model_parameters?: Json | null
          product_filters?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      actual_lead_time: {
        Row: {
          actual_lead_time_days: number
          created_at: string | null
          location_id: string
          product_id: string
          updated_at: string | null
        }
        Insert: {
          actual_lead_time_days: number
          created_at?: string | null
          location_id: string
          product_id: string
          updated_at?: string | null
        }
        Update: {
          actual_lead_time_days?: number
          created_at?: string | null
          location_id?: string
          product_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          change_timestamp: string | null
          changed_by: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          change_timestamp?: string | null
          changed_by: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          change_timestamp?: string | null
          changed_by?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      buffer_breach_events: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          breach_type: string
          created_at: string
          current_oh: number | null
          detected_ts: string
          event_id: number
          location_id: string
          product_id: string
          severity: string | null
          threshold: number | null
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          breach_type: string
          created_at?: string
          current_oh?: number | null
          detected_ts?: string
          event_id?: number
          location_id: string
          product_id: string
          severity?: string | null
          threshold?: number | null
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          breach_type?: string
          created_at?: string
          current_oh?: number | null
          detected_ts?: string
          event_id?: number
          location_id?: string
          product_id?: string
          severity?: string | null
          threshold?: number | null
        }
        Relationships: []
      }
      buffer_config: {
        Row: {
          key: string
          value: number | null
        }
        Insert: {
          key: string
          value?: number | null
        }
        Update: {
          key?: string
          value?: number | null
        }
        Relationships: []
      }
      buffer_profile_master: {
        Row: {
          buffer_profile_id: string
          created_at: string
          description: string | null
          lt_factor: number
          min_order_qty: number
          name: string
          order_cycle_days: number
          rounding_multiple: number
          updated_at: string
          variability_factor: number
        }
        Insert: {
          buffer_profile_id: string
          created_at?: string
          description?: string | null
          lt_factor?: number
          min_order_qty?: number
          name: string
          order_cycle_days?: number
          rounding_multiple?: number
          updated_at?: string
          variability_factor?: number
        }
        Update: {
          buffer_profile_id?: string
          created_at?: string
          description?: string | null
          lt_factor?: number
          min_order_qty?: number
          name?: string
          order_cycle_days?: number
          rounding_multiple?: number
          updated_at?: string
          variability_factor?: number
        }
        Relationships: []
      }
      buffer_profile_override: {
        Row: {
          buffer_profile_id: string
          green_multiplier_override: number | null
          location_id: string
          product_id: string
          yellow_multiplier_override: number | null
        }
        Insert: {
          buffer_profile_id: string
          green_multiplier_override?: number | null
          location_id: string
          product_id: string
          yellow_multiplier_override?: number | null
        }
        Update: {
          buffer_profile_id?: string
          green_multiplier_override?: number | null
          location_id?: string
          product_id?: string
          yellow_multiplier_override?: number | null
        }
        Relationships: []
      }
      channel_master: {
        Row: {
          channel_id: string
          channel_name: string
          description: string | null
        }
        Insert: {
          channel_id: string
          channel_name: string
          description?: string | null
        }
        Update: {
          channel_id?: string
          channel_name?: string
          description?: string | null
        }
        Relationships: []
      }
      classification_rules_history: {
        Row: {
          created_at: string | null
          created_by: string | null
          effective_from: string
          effective_to: string | null
          id: string
          rule_definition: Json
          rule_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          rule_definition: Json
          rule_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          rule_definition?: Json
          rule_type?: string
          updated_at?: string | null
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
      decoupling_points: {
        Row: {
          buffer_profile_id: string
          created_at: string
          designation_reason: string | null
          id: string
          is_strategic: boolean
          location_id: string
          product_id: string
          updated_at: string
        }
        Insert: {
          buffer_profile_id?: string
          created_at?: string
          designation_reason?: string | null
          id?: string
          is_strategic?: boolean
          location_id: string
          product_id: string
          updated_at?: string
        }
        Update: {
          buffer_profile_id?: string
          created_at?: string
          designation_reason?: string | null
          id?: string
          is_strategic?: boolean
          location_id?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      demand_adjustment_factor: {
        Row: {
          created_at: string
          daf: number
          end_date: string
          location_id: string
          product_id: string
          start_date: string
        }
        Insert: {
          created_at?: string
          daf?: number
          end_date: string
          location_id: string
          product_id: string
          start_date: string
        }
        Update: {
          created_at?: string
          daf?: number
          end_date?: string
          location_id?: string
          product_id?: string
          start_date?: string
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
        Relationships: []
      }
      historical_sales_data: {
        Row: {
          created_at: string | null
          location_id: string
          product_id: string
          quantity_sold: number
          revenue: number | null
          sales_date: string
          sales_id: string
          transaction_type: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          location_id: string
          product_id: string
          quantity_sold: number
          revenue?: number | null
          sales_date: string
          sales_id?: string
          transaction_type?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          location_id?: string
          product_id?: string
          quantity_sold?: number
          revenue?: number | null
          sales_date?: string
          sales_id?: string
          transaction_type?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      integrated_forecast_data: {
        Row: {
          actual_value: number | null
          created_at: string
          date: string
          id: string
          mapping_config: Json | null
          metadata: Json | null
          sku: string | null
          source_files: Json | null
          updated_at: string
          validation_status: string | null
        }
        Insert: {
          actual_value?: number | null
          created_at?: string
          date: string
          id?: string
          mapping_config?: Json | null
          metadata?: Json | null
          sku?: string | null
          source_files?: Json | null
          updated_at?: string
          validation_status?: string | null
        }
        Update: {
          actual_value?: number | null
          created_at?: string
          date?: string
          id?: string
          mapping_config?: Json | null
          metadata?: Json | null
          sku?: string | null
          source_files?: Json | null
          updated_at?: string
          validation_status?: string | null
        }
        Relationships: []
      }
      inventory_threshold_overrides: {
        Row: {
          override_value: number | null
          threshold_type: string
        }
        Insert: {
          override_value?: number | null
          threshold_type: string
        }
        Update: {
          override_value?: number | null
          threshold_type?: string
        }
        Relationships: []
      }
      lead_time_anomalies: {
        Row: {
          anomaly_score: number | null
          anomaly_type: string
          created_at: string | null
          description: string | null
          detection_date: string | null
          id: string
          resolution_status: string | null
          sku: string
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          anomaly_score?: number | null
          anomaly_type: string
          created_at?: string | null
          description?: string | null
          detection_date?: string | null
          id?: string
          resolution_status?: string | null
          sku: string
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          anomaly_score?: number | null
          anomaly_type?: string
          created_at?: string | null
          description?: string | null
          detection_date?: string | null
          id?: string
          resolution_status?: string | null
          sku?: string
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      location_master: {
        Row: {
          channel_id: string | null
          created_at: string | null
          location_id: string
          location_type: string | null
          region: string | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          location_id: string
          location_type?: string | null
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          location_id?: string
          location_type?: string | null
          region?: string | null
          updated_at?: string | null
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
      logistics_enhanced_orders: {
        Row: {
          actual_delivery: string | null
          carrier: string | null
          created_at: string | null
          estimated_delivery: string | null
          id: string
          metadata: Json | null
          order_ref: string
          priority: string | null
          shipping_method: string | null
          status: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery?: string | null
          carrier?: string | null
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          metadata?: Json | null
          order_ref: string
          priority?: string | null
          shipping_method?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery?: string | null
          carrier?: string | null
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          metadata?: Json | null
          order_ref?: string
          priority?: string | null
          shipping_method?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
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
      master_lead_time: {
        Row: {
          created_at: string | null
          location_id: string
          product_id: string
          standard_lead_time_days: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          location_id: string
          product_id: string
          standard_lead_time_days: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          location_id?: string
          product_id?: string
          standard_lead_time_days?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      model_testing_configs: {
        Row: {
          created_at: string | null
          id: string
          scenario_id: string | null
          testing_range: string | null
          testing_time_period: string | null
          training_range: string | null
          training_time_period: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          scenario_id?: string | null
          testing_range?: string | null
          testing_time_period?: string | null
          training_range?: string | null
          training_time_period?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          scenario_id?: string | null
          testing_range?: string | null
          testing_time_period?: string | null
          training_range?: string | null
          training_time_period?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      model_version_applications: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          location_id: string | null
          model_version_id: string | null
          performance_metrics: Json | null
          product_code: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          model_version_id?: string | null
          performance_metrics?: Json | null
          product_code?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          model_version_id?: string | null
          performance_metrics?: Json | null
          product_code?: string | null
          updated_at?: string | null
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
      on_hand_inventory: {
        Row: {
          created_at: string
          id: string
          location_id: string
          product_id: string
          qty_on_hand: number
          snapshot_ts: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          product_id: string
          qty_on_hand?: number
          snapshot_ts?: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          product_id?: string
          qty_on_hand?: number
          snapshot_ts?: string
        }
        Relationships: []
      }
      open_pos: {
        Row: {
          created_at: string
          expected_date: string | null
          id: string
          location_id: string
          order_date: string
          ordered_qty: number
          product_id: string
          received_qty: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expected_date?: string | null
          id?: string
          location_id: string
          order_date: string
          ordered_qty: number
          product_id: string
          received_qty?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expected_date?: string | null
          id?: string
          location_id?: string
          order_date?: string
          ordered_qty?: number
          product_id?: string
          received_qty?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      open_so: {
        Row: {
          confirmed_date: string
          created_at: string
          id: string
          location_id: string
          product_id: string
          qty: number
          status: string
        }
        Insert: {
          confirmed_date: string
          created_at?: string
          id?: string
          location_id: string
          product_id: string
          qty: number
          status?: string
        }
        Update: {
          confirmed_date?: string
          created_at?: string
          id?: string
          location_id?: string
          product_id?: string
          qty?: number
          status?: string
        }
        Relationships: []
      }
      performance_tracking: {
        Row: {
          channel_id: string | null
          created_at: string | null
          id: number
          lead_time_factor: number | null
          location_id: string
          overstock_count: number | null
          period_month: string
          product_id: string
          service_level: number | null
          stockout_count: number | null
          stockout_rate: number | null
          trend_factor: number | null
          turnover_rate: number | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          id?: number
          lead_time_factor?: number | null
          location_id: string
          overstock_count?: number | null
          period_month: string
          product_id: string
          service_level?: number | null
          stockout_count?: number | null
          stockout_rate?: number | null
          trend_factor?: number | null
          turnover_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          id?: number
          lead_time_factor?: number | null
          location_id?: string
          overstock_count?: number | null
          period_month?: string
          product_id?: string
          service_level?: number | null
          stockout_count?: number | null
          stockout_rate?: number | null
          trend_factor?: number | null
          turnover_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_channel"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channel_master"
            referencedColumns: ["channel_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      permanent_hierarchy_data: {
        Row: {
          created_at: string
          data: Json
          hierarchy_type: string
          id: string
          is_active: boolean
          source_upload_id: string | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          data?: Json
          hierarchy_type: string
          id?: string
          is_active?: boolean
          source_upload_id?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          data?: Json
          hierarchy_type?: string
          id?: string
          is_active?: boolean
          source_upload_id?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "permanent_hierarchy_data_source_upload_id_fkey"
            columns: ["source_upload_id"]
            isOneToOne: false
            referencedRelation: "permanent_hierarchy_files"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_hierarchy_files: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          file_name: string
          file_type: string | null
          hierarchy_type: string
          id: string
          original_name: string
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          file_name: string
          file_type?: string | null
          hierarchy_type: string
          id?: string
          original_name: string
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          file_name?: string
          file_type?: string | null
          hierarchy_type?: string
          id?: string
          original_name?: string
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_classification: {
        Row: {
          classification_label: string
          created_at: string | null
          criticality: string | null
          lead_time_category: string | null
          location_id: string
          product_id: string
          score: number | null
          variability_level: string | null
        }
        Insert: {
          classification_label: string
          created_at?: string | null
          criticality?: string | null
          lead_time_category?: string | null
          location_id: string
          product_id: string
          score?: number | null
          variability_level?: string | null
        }
        Update: {
          classification_label?: string
          created_at?: string | null
          criticality?: string | null
          lead_time_category?: string | null
          location_id?: string
          product_id?: string
          score?: number | null
          variability_level?: string | null
        }
        Relationships: []
      }
      product_location_pairs: {
        Row: {
          location_id: string | null
          product_id: string | null
        }
        Insert: {
          location_id?: string | null
          product_id?: string | null
        }
        Update: {
          location_id?: string | null
          product_id?: string | null
        }
        Relationships: []
      }
      product_master: {
        Row: {
          buffer_profile_id: string | null
          category: string | null
          created_at: string | null
          name: string
          notes: string | null
          planning_priority: string | null
          product_family: string | null
          product_id: string
          sku: string
          subcategory: string | null
          updated_at: string | null
        }
        Insert: {
          buffer_profile_id?: string | null
          category?: string | null
          created_at?: string | null
          name: string
          notes?: string | null
          planning_priority?: string | null
          product_family?: string | null
          product_id?: string
          sku: string
          subcategory?: string | null
          updated_at?: string | null
        }
        Update: {
          buffer_profile_id?: string | null
          category?: string | null
          created_at?: string | null
          name?: string
          notes?: string | null
          planning_priority?: string | null
          product_family?: string | null
          product_id?: string
          sku?: string
          subcategory?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      "product_pricing-master": {
        Row: {
          created_at: string | null
          currency: string | null
          effective_date: string
          price: number
          pricing_id: string
          product_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          effective_date: string
          price: number
          pricing_id?: string
          product_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          effective_date?: string
          price?: number
          pricing_id?: string
          product_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
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
      replenishment_orders: {
        Row: {
          created_at: string
          location_id: string
          product_id: string
          proposal_id: number
          proposal_ts: string
          qty_recommend: number
          reason: string
          source_view: string
          status: string
          target_due_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          location_id: string
          product_id: string
          proposal_id?: number
          proposal_ts?: string
          qty_recommend: number
          reason?: string
          source_view?: string
          status?: string
          target_due_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          location_id?: string
          product_id?: string
          proposal_id?: number
          proposal_ts?: string
          qty_recommend?: number
          reason?: string
          source_view?: string
          status?: string
          target_due_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_model_configs: {
        Row: {
          auto_run: boolean | null
          created_at: string | null
          id: string
          model_id: string
          parameters: Json | null
          product_id: string
          product_name: string
          updated_at: string | null
        }
        Insert: {
          auto_run?: boolean | null
          created_at?: string | null
          id?: string
          model_id: string
          parameters?: Json | null
          product_id: string
          product_name: string
          updated_at?: string | null
        }
        Update: {
          auto_run?: boolean | null
          created_at?: string | null
          id?: string
          model_id?: string
          parameters?: Json | null
          product_id?: string
          product_name?: string
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
      secrets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      service_level_override: {
        Row: {
          calculated_z_value: number | null
          created_at: string | null
          id: number
          location_id: string | null
          override_z_value: number | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          calculated_z_value?: number | null
          created_at?: string | null
          id?: number
          location_id?: string | null
          override_z_value?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          calculated_z_value?: number | null
          created_at?: string | null
          id?: number
          location_id?: string | null
          override_z_value?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      threshold_config: {
        Row: {
          decoupling_threshold: number | null
          demand_variability_threshold: number | null
          first_time_adjusted: boolean | null
          id: number
          updated_at: string | null
        }
        Insert: {
          decoupling_threshold?: number | null
          demand_variability_threshold?: number | null
          first_time_adjusted?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          decoupling_threshold?: number | null
          demand_variability_threshold?: number | null
          first_time_adjusted?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_master: {
        Row: {
          city: string | null
          contact_email: string | null
          contact_person: string | null
          country: string | null
          created_at: string | null
          is_active: boolean | null
          payment_terms: string | null
          phone_number: string | null
          region: string | null
          tax_number: string | null
          updated_at: string | null
          vendor_code: string
          vendor_id: string
          vendor_name: string
        }
        Insert: {
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          is_active?: boolean | null
          payment_terms?: string | null
          phone_number?: string | null
          region?: string | null
          tax_number?: string | null
          updated_at?: string | null
          vendor_code: string
          vendor_id?: string
          vendor_name: string
        }
        Update: {
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          is_active?: boolean | null
          payment_terms?: string | null
          phone_number?: string | null
          region?: string | null
          tax_number?: string | null
          updated_at?: string | null
          vendor_code?: string
          vendor_id?: string
          vendor_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_demand_nodes: {
        Row: {
          location_id: string | null
          product_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      adu_90d_view: {
        Row: {
          adu_adj: number | null
          location_id: string | null
          product_id: string | null
          window_days: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      daily_sales_base: {
        Row: {
          location_id: string | null
          product_id: string | null
          qty: number | null
          sales_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      inventory_ddmrp_buffers_view: {
        Row: {
          adu: number | null
          buffer_profile_id: string | null
          buffer_profile_name: string | null
          category: string | null
          dlt: number | null
          green_zone: number | null
          location_id: string | null
          lt_factor: number | null
          min_order_qty: number | null
          order_cycle_days: number | null
          product_id: string | null
          product_name: string | null
          red_zone: number | null
          rounding_multiple: number | null
          sku: string | null
          subcategory: string | null
          tog: number | null
          tor: number | null
          toy: number | null
          variability_factor: number | null
          yellow_zone: number | null
        }
        Relationships: []
      }
      lead_time_variability: {
        Row: {
          lead_time_stddev: number | null
          location_id: string | null
          observations: number | null
          product_id: string | null
        }
        Relationships: []
      }
      onhand_latest_view: {
        Row: {
          location_id: string | null
          product_id: string | null
          qty_on_hand: number | null
        }
        Relationships: []
      }
      onorder_view: {
        Row: {
          location_id: string | null
          product_id: string | null
          qty_on_order: number | null
        }
        Relationships: []
      }
      service_level_config: {
        Row: {
          calculated_z_value: number | null
          final_z_value: number | null
          location_id: string | null
          product_id: string | null
        }
        Relationships: []
      }
      trend_factor_view: {
        Row: {
          location_id: string | null
          product_id: string | null
          trend_factor: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
    }
    Functions: {
      activate_hierarchy_mapping: {
        Args: { p_mapping_id: string }
        Returns: undefined
      }
      activate_hierarchy_version: {
        Args: { p_hierarchy_type: string; p_version: number }
        Returns: undefined
      }
      assign_buffer_profiles_by_classification: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      ddmrp_nightly: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      detect_buffer_breaches: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      drop_hierarchy_column: {
        Args: { p_column_name: string; p_table_name: string }
        Returns: undefined
      }
      generate_replenishment: {
        Args: { location_id_filter?: string }
        Returns: number
      }
      get_inventory_planning_data: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_product_classifications: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_threshold_config: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      integrate_forecast_data: {
        Args: Record<PropertyKey, never> | { p_mapping_config: Json }
        Returns: string
      }
      process_hierarchy_configuration: {
        Args: {
          p_mappings: Json
          p_selected_columns: string[]
          p_table_name: string
        }
        Returns: undefined
      }
      remove_unselected_columns: {
        Args: { p_selected_columns: string[]; p_table_name: string }
        Returns: undefined
      }
      update_performance_tracking: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_threshold_bayesian: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_forecast_mapping: {
        Args: {
          p_historical_mapping: Json
          p_location_mapping: Json
          p_product_mapping: Json
        }
        Returns: boolean
      }
    }
    Enums: {
      decoupling_type:
        | "strategic"
        | "customer_order"
        | "stock_point"
        | "intermediate"
      hierarchy_level_type:
        | "L1"
        | "L2"
        | "L3"
        | "L4"
        | "L5"
        | "L6"
        | "L7"
        | "L8"
      hierarchy_status: "draft" | "active" | "archived"
      industry_type:
        | "manufacturing"
        | "retail"
        | "distribution"
        | "electronics"
        | "automotive"
        | "consumer_goods"
        | "pharmaceuticals"
      lead_time_category: "short" | "medium" | "long"
      lead_time_type: "short" | "medium" | "long"
      module_type:
        | "forecasting"
        | "inventory"
        | "sales"
        | "marketing"
        | "logistics"
        | "location_hierarchy"
        | "product_hierarchy"
      variability_type:
        | "high_variability"
        | "medium_variability"
        | "low_variability"
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
      decoupling_type: [
        "strategic",
        "customer_order",
        "stock_point",
        "intermediate",
      ],
      hierarchy_level_type: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
      hierarchy_status: ["draft", "active", "archived"],
      industry_type: [
        "manufacturing",
        "retail",
        "distribution",
        "electronics",
        "automotive",
        "consumer_goods",
        "pharmaceuticals",
      ],
      lead_time_category: ["short", "medium", "long"],
      lead_time_type: ["short", "medium", "long"],
      module_type: [
        "forecasting",
        "inventory",
        "sales",
        "marketing",
        "logistics",
        "location_hierarchy",
        "product_hierarchy",
      ],
      variability_type: [
        "high_variability",
        "medium_variability",
        "low_variability",
      ],
    },
  },
} as const
