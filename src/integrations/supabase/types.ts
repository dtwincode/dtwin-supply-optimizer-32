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
      buffer_configuration: {
        Row: {
          adu: number
          buffer_id: string
          created_at: string | null
          green_zone_size: number
          location_id: string
          product_id: string
          red_zone_size: number
          service_level: number | null
          updated_at: string | null
          variability_factor: number | null
          yellow_zone_size: number
        }
        Insert: {
          adu: number
          buffer_id?: string
          created_at?: string | null
          green_zone_size: number
          location_id: string
          product_id: string
          red_zone_size: number
          service_level?: number | null
          updated_at?: string | null
          variability_factor?: number | null
          yellow_zone_size: number
        }
        Update: {
          adu?: number
          buffer_id?: string
          created_at?: string | null
          green_zone_size?: number
          location_id?: string
          product_id?: string
          red_zone_size?: number
          service_level?: number | null
          updated_at?: string | null
          variability_factor?: number | null
          yellow_zone_size?: number
        }
        Relationships: [
          {
            foreignKeyName: "buffer_configuration_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "buffer_configuration_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      buffer_factor_benchmarks: {
        Row: {
          created_at: string
          description: string | null
          green_zone_factor: number
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          long_lead_time_factor: number
          medium_lead_time_factor: number
          short_lead_time_factor: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          green_zone_factor: number
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          long_lead_time_factor: number
          medium_lead_time_factor: number
          short_lead_time_factor: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          green_zone_factor?: number
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          long_lead_time_factor?: number
          medium_lead_time_factor?: number
          short_lead_time_factor?: number
          updated_at?: string
        }
        Relationships: []
      }
      buffer_factor_configs: {
        Row: {
          created_at: string
          description: string | null
          green_zone_factor: number
          id: string
          industry: Database["public"]["Enums"]["industry_type"] | null
          is_active: boolean
          is_benchmark_based: boolean | null
          is_global: boolean | null
          long_lead_time_factor: number
          medium_lead_time_factor: number
          medium_lead_time_threshold: number
          metadata: Json | null
          replenishment_time_factor: number
          short_lead_time_factor: number
          short_lead_time_threshold: number
          sku: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          green_zone_factor?: number
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"] | null
          is_active?: boolean
          is_benchmark_based?: boolean | null
          is_global?: boolean | null
          long_lead_time_factor?: number
          medium_lead_time_factor?: number
          medium_lead_time_threshold?: number
          metadata?: Json | null
          replenishment_time_factor?: number
          short_lead_time_factor?: number
          short_lead_time_threshold?: number
          sku?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          green_zone_factor?: number
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"] | null
          is_active?: boolean
          is_benchmark_based?: boolean | null
          is_global?: boolean | null
          long_lead_time_factor?: number
          medium_lead_time_factor?: number
          medium_lead_time_threshold?: number
          metadata?: Json | null
          replenishment_time_factor?: number
          short_lead_time_factor?: number
          short_lead_time_threshold?: number
          sku?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      buffer_profiles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          lead_time_factor: Database["public"]["Enums"]["lead_time_type"] | null
          lot_size_factor: number | null
          moq: number | null
          name: string
          updated_at: string
          variability_factor:
            | Database["public"]["Enums"]["variability_type"]
            | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          lead_time_factor?:
            | Database["public"]["Enums"]["lead_time_type"]
            | null
          lot_size_factor?: number | null
          moq?: number | null
          name: string
          updated_at?: string
          variability_factor?:
            | Database["public"]["Enums"]["variability_type"]
            | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          lead_time_factor?:
            | Database["public"]["Enums"]["lead_time_type"]
            | null
          lot_size_factor?: number | null
          moq?: number | null
          name?: string
          updated_at?: string
          variability_factor?:
            | Database["public"]["Enums"]["variability_type"]
            | null
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
      ddmrp_metrics_history: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string | null
          metric_type: string
          metric_value: number
          recorded_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          metric_type: string
          metric_value: number
          recorded_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      decoupling_points: {
        Row: {
          buffer_profile_id: string
          created_at: string
          description: string | null
          id: string
          location_id: string
          type: Database["public"]["Enums"]["decoupling_type"]
          updated_at: string
        }
        Insert: {
          buffer_profile_id: string
          created_at?: string
          description?: string | null
          id?: string
          location_id: string
          type: Database["public"]["Enums"]["decoupling_type"]
          updated_at?: string
        }
        Update: {
          buffer_profile_id?: string
          created_at?: string
          description?: string | null
          id?: string
          location_id?: string
          type?: Database["public"]["Enums"]["decoupling_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "decoupling_points_buffer_profile_id_fkey"
            columns: ["buffer_profile_id"]
            isOneToOne: false
            referencedRelation: "buffer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decoupling_points_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_hierarchy"
            referencedColumns: ["location_id"]
          },
        ]
      }
      external_factors: {
        Row: {
          created_at: string | null
          factor_type: string
          factor_value: Json
          id: string
          impact_score: number | null
          recorded_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          factor_type: string
          factor_value: Json
          id?: string
          impact_score?: number | null
          recorded_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          factor_type?: string
          factor_value?: Json
          id?: string
          impact_score?: number | null
          recorded_date?: string | null
          updated_at?: string | null
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
          l1_main_prod: string | null
          l2_prod_line: string | null
          l3_prod_category: string | null
          l4_device_make: string | null
          l5_prod_sub_category: string | null
          l6_device_model: string | null
          l7_device_color: string | null
          l8_device_storage: string | null
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
          l1_main_prod?: string | null
          l2_prod_line?: string | null
          l3_prod_category?: string | null
          l4_device_make?: string | null
          l5_prod_sub_category?: string | null
          l6_device_model?: string | null
          l7_device_color?: string | null
          l8_device_storage?: string | null
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
          l1_main_prod?: string | null
          l2_prod_line?: string | null
          l3_prod_category?: string | null
          l4_device_make?: string | null
          l5_prod_sub_category?: string | null
          l6_device_model?: string | null
          l7_device_color?: string | null
          l8_device_storage?: string | null
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
      forecast_integration_mappings: {
        Row: {
          columns_config: string | null
          created_at: string
          created_by: string | null
          description: string | null
          historical_key_column: string | null
          historical_location_key_column: string | null
          historical_product_key_column: string | null
          historical_sales_mapping: Json
          id: string
          is_active: boolean | null
          location_hierarchy_mapping: Json
          location_key_column: string | null
          mapping_name: string
          product_hierarchy_mapping: Json
          product_key_column: string | null
          selected_columns_array: string[] | null
          updated_at: string
          use_location_mapping: boolean | null
          use_product_mapping: boolean | null
        }
        Insert: {
          columns_config?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          historical_key_column?: string | null
          historical_location_key_column?: string | null
          historical_product_key_column?: string | null
          historical_sales_mapping?: Json
          id?: string
          is_active?: boolean | null
          location_hierarchy_mapping?: Json
          location_key_column?: string | null
          mapping_name: string
          product_hierarchy_mapping?: Json
          product_key_column?: string | null
          selected_columns_array?: string[] | null
          updated_at?: string
          use_location_mapping?: boolean | null
          use_product_mapping?: boolean | null
        }
        Update: {
          columns_config?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          historical_key_column?: string | null
          historical_location_key_column?: string | null
          historical_product_key_column?: string | null
          historical_sales_mapping?: Json
          id?: string
          is_active?: boolean | null
          location_hierarchy_mapping?: Json
          location_key_column?: string | null
          mapping_name?: string
          product_hierarchy_mapping?: Json
          product_key_column?: string | null
          selected_columns_array?: string[] | null
          updated_at?: string
          use_location_mapping?: boolean | null
          use_product_mapping?: boolean | null
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
      forecast_test_periods: {
        Row: {
          accuracy_metrics: Json | null
          created_at: string | null
          id: string
          scenario_id: string | null
          testing_end_date: string
          testing_start_date: string
          training_end_date: string
          training_start_date: string
          updated_at: string | null
        }
        Insert: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          id?: string
          scenario_id?: string | null
          testing_end_date: string
          testing_start_date: string
          training_end_date: string
          training_start_date: string
          updated_at?: string | null
        }
        Update: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          id?: string
          scenario_id?: string | null
          testing_end_date?: string
          testing_start_date?: string
          training_end_date?: string
          training_start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forecast_test_periods_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      hierarchy_column_mappings: {
        Row: {
          column_name: string
          created_at: string | null
          hierarchy_level: number | null
          id: string
          main_level: number | null
          table_name: string
          updated_at: string | null
        }
        Insert: {
          column_name: string
          created_at?: string | null
          hierarchy_level?: number | null
          id?: string
          main_level?: number | null
          table_name: string
          updated_at?: string | null
        }
        Update: {
          column_name?: string
          created_at?: string | null
          hierarchy_level?: number | null
          id?: string
          main_level?: number | null
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hierarchy_column_selections: {
        Row: {
          created_at: string | null
          id: string
          selected_columns: string[]
          table_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          selected_columns: string[]
          table_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          selected_columns?: string[]
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hierarchy_file_references: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          file_name: string
          file_type: string
          hierarchy_type: string
          id: string
          original_name: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data: Json
          file_name: string
          file_type: string
          hierarchy_type: string
          id?: string
          original_name: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          file_name?: string
          file_type?: string
          hierarchy_type?: string
          id?: string
          original_name?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      hierarchy_mappings: {
        Row: {
          created_at: string | null
          hierarchy_type: string
          id: string
          is_active: boolean | null
          mappings: Json
          selected_columns: string[]
          temp_upload_id: string | null
        }
        Insert: {
          created_at?: string | null
          hierarchy_type: string
          id?: string
          is_active?: boolean | null
          mappings: Json
          selected_columns: string[]
          temp_upload_id?: string | null
        }
        Update: {
          created_at?: string | null
          hierarchy_type?: string
          id?: string
          is_active?: boolean | null
          mappings?: Json
          selected_columns?: string[]
          temp_upload_id?: string | null
        }
        Relationships: []
      }
      hierarchy_versions: {
        Row: {
          changes_summary: string | null
          created_at: string | null
          created_by: string | null
          hierarchy_type: string
          id: string
          version: number
        }
        Insert: {
          changes_summary?: string | null
          created_at?: string | null
          created_by?: string | null
          hierarchy_type: string
          id?: string
          version: number
        }
        Update: {
          changes_summary?: string | null
          created_at?: string | null
          created_by?: string | null
          hierarchy_type?: string
          id?: string
          version?: number
        }
        Relationships: []
      }
      historical_sales_data: {
        Row: {
          created_at: string | null
          location_id: string
          product_id: string
          quantity_sold: number
          revenue: number
          sales_date: string
          sales_id: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          location_id: string
          product_id: string
          quantity_sold: number
          revenue: number
          sales_date: string
          sales_id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          location_id?: string
          product_id?: string
          quantity_sold?: number
          revenue?: number
          sales_date?: string
          sales_id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
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
      inventory_data: {
        Row: {
          available_qty: number | null
          inventory_id: string
          last_updated: string | null
          location_id: string
          product_id: string
          quantity_on_hand: number
          reserved_qty: number | null
        }
        Insert: {
          available_qty?: number | null
          inventory_id?: string
          last_updated?: string | null
          location_id: string
          product_id: string
          quantity_on_hand: number
          reserved_qty?: number | null
        }
        Update: {
          available_qty?: number | null
          inventory_id?: string
          last_updated?: string | null
          location_id?: string
          product_id?: string
          quantity_on_hand?: number
          reserved_qty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_data_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "inventory_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
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
      lead_time_data: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          is_active: boolean | null
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data: Json
          id?: string
          is_active?: boolean | null
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          is_active?: boolean | null
          version?: number | null
        }
        Relationships: []
      }
      lead_time_predictions: {
        Row: {
          confidence_score: number
          created_at: string | null
          factors_considered: Json | null
          id: string
          predicted_lead_time: number
          prediction_date: string | null
          sku: string
          supplier_id: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          confidence_score: number
          created_at?: string | null
          factors_considered?: Json | null
          id?: string
          predicted_lead_time: number
          prediction_date?: string | null
          sku: string
          supplier_id: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          factors_considered?: Json | null
          id?: string
          predicted_lead_time?: number
          prediction_date?: string | null
          sku?: string
          supplier_id?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      location_hierarchy: {
        Row: {
          active: boolean | null
          channel: string | null
          channel_id: string
          city: string | null
          code: string | null
          coordinates: Json | null
          country: string | null
          created_at: string | null
          display_name: string | null
          hierarchy_level: number | null
          id: string
          last_updated_at: string | null
          last_updated_by: string | null
          location_desc: string | null
          location_description: string | null
          location_id: string
          location_type: string | null
          metadata: Json | null
          org_id: string | null
          parent_id: string | null
          region: string | null
          sub_channel: string | null
          updated_at: string | null
          warehouse: string | null
        }
        Insert: {
          active?: boolean | null
          channel?: string | null
          channel_id: string
          city?: string | null
          code?: string | null
          coordinates?: Json | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          hierarchy_level?: number | null
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          location_desc?: string | null
          location_description?: string | null
          location_id: string
          location_type?: string | null
          metadata?: Json | null
          org_id?: string | null
          parent_id?: string | null
          region?: string | null
          sub_channel?: string | null
          updated_at?: string | null
          warehouse?: string | null
        }
        Update: {
          active?: boolean | null
          channel?: string | null
          channel_id?: string
          city?: string | null
          code?: string | null
          coordinates?: Json | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          hierarchy_level?: number | null
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          location_desc?: string | null
          location_description?: string | null
          location_id?: string
          location_type?: string | null
          metadata?: Json | null
          org_id?: string | null
          parent_id?: string | null
          region?: string | null
          sub_channel?: string | null
          updated_at?: string | null
          warehouse?: string | null
        }
        Relationships: []
      }
      location_hierarchy_files: {
        Row: {
          created_at: string
          created_by: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          original_name: string
          temp_upload_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          original_name: string
          temp_upload_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          original_name?: string
          temp_upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_hierarchy_files_temp_upload_id_fkey"
            columns: ["temp_upload_id"]
            isOneToOne: false
            referencedRelation: "temp_hierarchy_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      location_master: {
        Row: {
          channel: string | null
          city: string | null
          created_at: string | null
          location_id: string
          region: string | null
          updated_at: string | null
          warehouse: string
        }
        Insert: {
          channel?: string | null
          city?: string | null
          created_at?: string | null
          location_id?: string
          region?: string | null
          updated_at?: string | null
          warehouse: string
        }
        Update: {
          channel?: string | null
          city?: string | null
          created_at?: string | null
          location_id?: string
          region?: string | null
          updated_at?: string | null
          warehouse?: string
        }
        Relationships: []
      }
      logistics_analytics: {
        Row: {
          created_at: string | null
          dimension: string | null
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number | null
          timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dimension?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value?: number | null
          timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dimension?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number | null
          timestamp?: string | null
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
      logistics_documents: {
        Row: {
          created_at: string
          document_type: string
          file_url: string | null
          id: string
          metadata: Json | null
          order_id: string
          status: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          status?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          status?: string | null
          updated_at?: string
          version?: number | null
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
      logistics_tracking: {
        Row: {
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          order_id: string
          status: string | null
          timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_id: string
          status?: string | null
          timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_id?: string
          status?: string | null
          timestamp?: string | null
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
        Relationships: [
          {
            foreignKeyName: "model_testing_configs_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      model_training_history: {
        Row: {
          created_at: string | null
          id: string
          model_version: string
          trained_at: string | null
          training_metrics: Json | null
          training_parameters: Json | null
          updated_at: string | null
          validation_metrics: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          model_version: string
          trained_at?: string | null
          training_metrics?: Json | null
          training_parameters?: Json | null
          updated_at?: string | null
          validation_metrics?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          model_version?: string
          trained_at?: string | null
          training_metrics?: Json | null
          training_parameters?: Json | null
          updated_at?: string | null
          validation_metrics?: Json | null
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
        Relationships: [
          {
            foreignKeyName: "model_version_applications_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_hierarchy"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "model_version_applications_model_version_id_fkey"
            columns: ["model_version_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_version_applications_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "product_hierarchy"
            referencedColumns: ["code"]
          },
        ]
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
      permanent_hierarchy_data: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          hierarchy_type: string
          id: string
          is_active: boolean | null
          source_upload_id: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data: Json
          hierarchy_type: string
          id?: string
          is_active?: boolean | null
          source_upload_id?: string | null
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          hierarchy_type?: string
          id?: string
          is_active?: boolean | null
          source_upload_id?: string | null
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
          created_by: string
          data: Json
          file_name: string
          file_size: number | null
          hierarchy_type: string
          id: string
          metadata: Json | null
          original_name: string
          selected_columns: string[]
        }
        Insert: {
          created_at?: string
          created_by: string
          data: Json
          file_name: string
          file_size?: number | null
          hierarchy_type: string
          id?: string
          metadata?: Json | null
          original_name: string
          selected_columns: string[]
        }
        Update: {
          created_at?: string
          created_by?: string
          data?: Json
          file_name?: string
          file_size?: number | null
          hierarchy_type?: string
          id?: string
          metadata?: Json | null
          original_name?: string
          selected_columns?: string[]
        }
        Relationships: []
      }
      prediction_accuracy_tracking: {
        Row: {
          actual_lead_time: number | null
          analysis_date: string | null
          created_at: string | null
          id: string
          impact_on_buffer: number | null
          prediction_error: number | null
          prediction_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_lead_time?: number | null
          analysis_date?: string | null
          created_at?: string | null
          id?: string
          impact_on_buffer?: number | null
          prediction_error?: number | null
          prediction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_lead_time?: number | null
          analysis_date?: string | null
          created_at?: string | null
          id?: string
          impact_on_buffer?: number | null
          prediction_error?: number | null
          prediction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prediction_accuracy_tracking_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "lead_time_predictions"
            referencedColumns: ["id"]
          },
        ]
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
      pricing: {
        Row: {
          created_at: string | null
          effective_date: string
          location_id: string
          price: number
          price_id: string
          product_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          effective_date: string
          location_id: string
          price: number
          price_id?: string
          product_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          effective_date?: string
          location_id?: string
          price?: number
          price_id?: string
          product_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_hierarchy: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          id: string
          l1_main_prod: string | null
          l2_prod_line: string | null
          l3_prod_category: string | null
          l4_device_make: string | null
          l5_prod_sub_category: string | null
          l6_device_model: string | null
          l7_device_color: string | null
          l8_device_storage: string | null
          level: number
          level_name: string
          name: string
          npi_product: boolean | null
          parent_code: string | null
          planning_desc: string | null
          sku: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          id?: string
          l1_main_prod?: string | null
          l2_prod_line?: string | null
          l3_prod_category?: string | null
          l4_device_make?: string | null
          l5_prod_sub_category?: string | null
          l6_device_model?: string | null
          l7_device_color?: string | null
          l8_device_storage?: string | null
          level: number
          level_name: string
          name: string
          npi_product?: boolean | null
          parent_code?: string | null
          planning_desc?: string | null
          sku: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          id?: string
          l1_main_prod?: string | null
          l2_prod_line?: string | null
          l3_prod_category?: string | null
          l4_device_make?: string | null
          l5_prod_sub_category?: string | null
          l6_device_model?: string | null
          l7_device_color?: string | null
          l8_device_storage?: string | null
          level?: number
          level_name?: string
          name?: string
          npi_product?: boolean | null
          parent_code?: string | null
          planning_desc?: string | null
          sku?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_master: {
        Row: {
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
      product_pricing: {
        Row: {
          created_at: string | null
          currency: string | null
          effective_date: string
          location_id: string | null
          price: number
          pricing_id: string
          product_id: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          effective_date: string
          location_id?: string | null
          price: number
          pricing_id?: string
          product_id: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          effective_date?: string
          location_id?: string | null
          price?: number
          pricing_id?: string
          product_id?: string
          updated_at?: string | null
          vendor_id?: string | null
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
      purchase_orders: {
        Row: {
          created_at: string
          id: string
          order_date: string | null
          po_number: string
          quantity: number
          sku: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_date?: string | null
          po_number: string
          quantity: number
          sku: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_date?: string | null
          po_number?: string
          quantity?: number
          sku?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      replenishment_data: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          is_active: boolean | null
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data: Json
          id?: string
          is_active?: boolean | null
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          is_active?: boolean | null
          version?: number | null
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
      sku_classification_history: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          created_at: string | null
          id: string
          new_classification: Json | null
          previous_classification: Json | null
          sku: string
          updated_at: string | null
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          created_at?: string | null
          id?: string
          new_classification?: Json | null
          previous_classification?: Json | null
          sku: string
          updated_at?: string | null
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          created_at?: string | null
          id?: string
          new_classification?: Json | null
          previous_classification?: Json | null
          sku?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      temp_hierarchy_uploads: {
        Row: {
          created_at: string
          file_type: string
          filename: string
          headers: Json | null
          hierarchy_type: string
          id: string
          original_name: string
          processed_at: string | null
          processed_by: string | null
          processing_error: string | null
          row_count: number | null
          sample_data: Json | null
          status: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_type: string
          filename: string
          headers?: Json | null
          hierarchy_type: string
          id?: string
          original_name: string
          processed_at?: string | null
          processed_by?: string | null
          processing_error?: string | null
          row_count?: number | null
          sample_data?: Json | null
          status?: string
          storage_path: string
        }
        Update: {
          created_at?: string
          file_type?: string
          filename?: string
          headers?: Json | null
          hierarchy_type?: string
          id?: string
          original_name?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_error?: string | null
          row_count?: number | null
          sample_data?: Json | null
          status?: string
          storage_path?: string
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
      location_hierarchy_flat: {
        Row: {
          active: boolean | null
          channel: string | null
          channel_id: string | null
          city: string | null
          code: string | null
          coordinates: Json | null
          country: string | null
          created_at: string | null
          display_name: string | null
          hierarchy_level: number | null
          id: string | null
          last_updated_at: string | null
          last_updated_by: string | null
          location_desc: string | null
          location_description: string | null
          location_id: string | null
          location_type: string | null
          metadata: Json | null
          org_id: string | null
          parent_id: string | null
          path: string[] | null
          region: string | null
          row_num: number | null
          sub_channel: string | null
          updated_at: string | null
          warehouse: string | null
        }
        Relationships: []
      }
      location_hierarchy_view: {
        Row: {
          active: boolean | null
          channel: string | null
          channel_id: string | null
          city: string | null
          country: string | null
          display_name: string | null
          hierarchy_level: number | null
          id: string | null
          level: number | null
          location_id: string | null
          location_type: string | null
          parent_id: string | null
          path: string[] | null
          region: string | null
          warehouse: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_hierarchy_mapping: {
        Args: {
          p_mapping_id: string
        }
        Returns: undefined
      }
      activate_hierarchy_version: {
        Args: {
          p_hierarchy_type: string
          p_version: number
        }
        Returns: undefined
      }
      drop_hierarchy_column: {
        Args: {
          p_table_name: string
          p_column_name: string
        }
        Returns: undefined
      }
      integrate_forecast_data:
        | {
            Args: Record<PropertyKey, never>
            Returns: string
          }
        | {
            Args: {
              p_mapping_config: Json
            }
            Returns: string
          }
      process_hierarchy_configuration: {
        Args: {
          p_table_name: string
          p_selected_columns: string[]
          p_mappings: Json
        }
        Returns: undefined
      }
      remove_unselected_columns: {
        Args: {
          p_table_name: string
          p_selected_columns: string[]
        }
        Returns: undefined
      }
      validate_forecast_mapping: {
        Args: {
          p_historical_mapping: Json
          p_product_mapping: Json
          p_location_mapping: Json
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
