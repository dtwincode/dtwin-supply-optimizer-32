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
      alignment_violations: {
        Row: {
          detected_at: string | null
          id: string
          location_id: string
          product_id: string | null
          resolution_action: string | null
          resolved_at: string | null
          status: string | null
          violation_type: string
        }
        Insert: {
          detected_at?: string | null
          id?: string
          location_id: string
          product_id?: string | null
          resolution_action?: string | null
          resolved_at?: string | null
          status?: string | null
          violation_type: string
        }
        Update: {
          detected_at?: string | null
          id?: string
          location_id?: string
          product_id?: string | null
          resolution_action?: string | null
          resolved_at?: string | null
          status?: string | null
          violation_type?: string
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
      buffer_criteria_compliance: {
        Row: {
          bidirectional_downstream_benefit: string | null
          bidirectional_test_passed: boolean | null
          bidirectional_test_score: number | null
          bidirectional_upstream_benefit: string | null
          created_at: string
          decoupling_test_notes: string | null
          decoupling_test_passed: boolean | null
          decoupling_test_score: number | null
          dynamic_adjustment_passed: boolean | null
          dynamic_adjustment_score: number | null
          forecast_vs_actual_ratio: number | null
          has_active_daf: boolean | null
          has_active_ltaf: boolean | null
          has_active_zaf: boolean | null
          id: string
          location_id: string
          order_independence_notes: string | null
          order_independence_passed: boolean | null
          order_independence_score: number | null
          overall_compliance_score: number | null
          overall_status: string | null
          primary_planning_passed: boolean | null
          primary_planning_score: number | null
          product_id: string
          relative_priority_passed: boolean | null
          relative_priority_score: number | null
          test_date: string
          uses_penetration_priority: boolean | null
        }
        Insert: {
          bidirectional_downstream_benefit?: string | null
          bidirectional_test_passed?: boolean | null
          bidirectional_test_score?: number | null
          bidirectional_upstream_benefit?: string | null
          created_at?: string
          decoupling_test_notes?: string | null
          decoupling_test_passed?: boolean | null
          decoupling_test_score?: number | null
          dynamic_adjustment_passed?: boolean | null
          dynamic_adjustment_score?: number | null
          forecast_vs_actual_ratio?: number | null
          has_active_daf?: boolean | null
          has_active_ltaf?: boolean | null
          has_active_zaf?: boolean | null
          id?: string
          location_id: string
          order_independence_notes?: string | null
          order_independence_passed?: boolean | null
          order_independence_score?: number | null
          overall_compliance_score?: number | null
          overall_status?: string | null
          primary_planning_passed?: boolean | null
          primary_planning_score?: number | null
          product_id: string
          relative_priority_passed?: boolean | null
          relative_priority_score?: number | null
          test_date?: string
          uses_penetration_priority?: boolean | null
        }
        Update: {
          bidirectional_downstream_benefit?: string | null
          bidirectional_test_passed?: boolean | null
          bidirectional_test_score?: number | null
          bidirectional_upstream_benefit?: string | null
          created_at?: string
          decoupling_test_notes?: string | null
          decoupling_test_passed?: boolean | null
          decoupling_test_score?: number | null
          dynamic_adjustment_passed?: boolean | null
          dynamic_adjustment_score?: number | null
          forecast_vs_actual_ratio?: number | null
          has_active_daf?: boolean | null
          has_active_ltaf?: boolean | null
          has_active_zaf?: boolean | null
          id?: string
          location_id?: string
          order_independence_notes?: string | null
          order_independence_passed?: boolean | null
          order_independence_score?: number | null
          overall_compliance_score?: number | null
          overall_status?: string | null
          primary_planning_passed?: boolean | null
          primary_planning_score?: number | null
          product_id?: string
          relative_priority_passed?: boolean | null
          relative_priority_score?: number | null
          test_date?: string
          uses_penetration_priority?: boolean | null
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
      buffer_recalculation_history: {
        Row: {
          change_reason: string | null
          daf_applied: number | null
          id: string
          location_id: string
          ltaf_applied: number | null
          new_adu: number
          new_dlt: number
          new_green_zone: number
          new_red_zone: number
          new_yellow_zone: number
          old_adu: number | null
          old_dlt: number | null
          old_green_zone: number | null
          old_red_zone: number | null
          old_yellow_zone: number | null
          product_id: string
          recalc_ts: string
          trend_factor: number | null
          triggered_by: string | null
        }
        Insert: {
          change_reason?: string | null
          daf_applied?: number | null
          id?: string
          location_id: string
          ltaf_applied?: number | null
          new_adu: number
          new_dlt: number
          new_green_zone: number
          new_red_zone: number
          new_yellow_zone: number
          old_adu?: number | null
          old_dlt?: number | null
          old_green_zone?: number | null
          old_red_zone?: number | null
          old_yellow_zone?: number | null
          product_id: string
          recalc_ts?: string
          trend_factor?: number | null
          triggered_by?: string | null
        }
        Update: {
          change_reason?: string | null
          daf_applied?: number | null
          id?: string
          location_id?: string
          ltaf_applied?: number | null
          new_adu?: number
          new_dlt?: number
          new_green_zone?: number
          new_red_zone?: number
          new_yellow_zone?: number
          old_adu?: number | null
          old_dlt?: number | null
          old_green_zone?: number | null
          old_red_zone?: number | null
          old_yellow_zone?: number | null
          product_id?: string
          recalc_ts?: string
          trend_factor?: number | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buffer_recalculation_history_product_id_location_id_fkey"
            columns: ["product_id", "location_id"]
            isOneToOne: false
            referencedRelation: "decoupling_points"
            referencedColumns: ["product_id", "location_id"]
          },
        ]
      }
      buffer_recalculation_schedule: {
        Row: {
          created_at: string
          cron_expression: string
          id: string
          is_active: boolean
          last_run_at: string | null
          next_run_at: string | null
          schedule_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cron_expression: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          schedule_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cron_expression?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          schedule_name?: string
          updated_at?: string
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
      decoupling_recommendations: {
        Row: {
          created_at: string | null
          decided_at: string | null
          decided_by: string | null
          decision_reason: string | null
          factor_breakdown: Json
          id: string
          location_id: string
          planner_decision: string | null
          product_id: string
          recommendation: string
          total_score: number
        }
        Insert: {
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_reason?: string | null
          factor_breakdown: Json
          id?: string
          location_id: string
          planner_decision?: string | null
          product_id: string
          recommendation: string
          total_score: number
        }
        Update: {
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_reason?: string | null
          factor_breakdown?: Json
          id?: string
          location_id?: string
          planner_decision?: string | null
          product_id?: string
          recommendation?: string
          total_score?: number
        }
        Relationships: []
      }
      decoupling_weights_config: {
        Row: {
          created_at: string | null
          criticality_weight: number | null
          holding_cost_weight: number | null
          id: string
          is_active: boolean | null
          lead_time_weight: number | null
          scenario_name: string
          supplier_reliability_weight: number | null
          updated_at: string | null
          variability_weight: number | null
          volume_weight: number | null
        }
        Insert: {
          created_at?: string | null
          criticality_weight?: number | null
          holding_cost_weight?: number | null
          id?: string
          is_active?: boolean | null
          lead_time_weight?: number | null
          scenario_name: string
          supplier_reliability_weight?: number | null
          updated_at?: string | null
          variability_weight?: number | null
          volume_weight?: number | null
        }
        Update: {
          created_at?: string | null
          criticality_weight?: number | null
          holding_cost_weight?: number | null
          id?: string
          is_active?: boolean | null
          lead_time_weight?: number | null
          scenario_name?: string
          supplier_reliability_weight?: number | null
          updated_at?: string | null
          variability_weight?: number | null
          volume_weight?: number | null
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
      demand_history_analysis: {
        Row: {
          analysis_period_end: string
          analysis_period_start: string
          created_at: string | null
          cv: number | null
          id: string
          location_id: string
          mean_demand: number
          product_id: string
          sku: string
          std_dev_demand: number
          updated_at: string | null
          variability_score: number
        }
        Insert: {
          analysis_period_end: string
          analysis_period_start: string
          created_at?: string | null
          cv?: number | null
          id?: string
          location_id: string
          mean_demand?: number
          product_id: string
          sku: string
          std_dev_demand?: number
          updated_at?: string | null
          variability_score?: number
        }
        Update: {
          analysis_period_end?: string
          analysis_period_start?: string
          created_at?: string | null
          cv?: number | null
          id?: string
          location_id?: string
          mean_demand?: number
          product_id?: string
          sku?: string
          std_dev_demand?: number
          updated_at?: string | null
          variability_score?: number
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
            referencedRelation: "execution_priority_view"
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
      inventory_carrying_costs: {
        Row: {
          created_at: string | null
          id: string
          insurance_rate_annual: number | null
          location_id: string
          obsolescence_rate_annual: number | null
          opportunity_cost_rate_annual: number | null
          product_category: string
          storage_cost_per_unit_per_day: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          insurance_rate_annual?: number | null
          location_id: string
          obsolescence_rate_annual?: number | null
          opportunity_cost_rate_annual?: number | null
          product_category: string
          storage_cost_per_unit_per_day: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          insurance_rate_annual?: number | null
          location_id?: string
          obsolescence_rate_annual?: number | null
          opportunity_cost_rate_annual?: number | null
          product_category?: string
          storage_cost_per_unit_per_day?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_config: {
        Row: {
          category: string
          config_key: string
          config_value: number
          created_at: string | null
          description: string | null
          id: string
          last_updated_by: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          config_key: string
          config_value: number
          created_at?: string | null
          description?: string | null
          id?: string
          last_updated_by?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          config_key?: string
          config_value?: number
          created_at?: string | null
          description?: string | null
          id?: string
          last_updated_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_config_audit: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by: string | null
          config_id: string
          config_key: string
          id: string
          new_value: number
          old_value: number
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          config_id: string
          config_key: string
          id?: string
          new_value: number
          old_value: number
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          config_id?: string
          config_key?: string
          id?: string
          new_value?: number
          old_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_config_audit_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "inventory_config"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_time_adjustment_factor: {
        Row: {
          created_at: string
          end_date: string
          location_id: string
          ltaf: number
          product_id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          location_id: string
          ltaf?: number
          product_id: string
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          location_id?: string
          ltaf?: number
          product_id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: []
      }
      lead_time_components: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          manufacturing_time_days: number | null
          procurement_time_days: number | null
          product_id: string
          shipping_time_days: number | null
          total_lead_time_days: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          manufacturing_time_days?: number | null
          procurement_time_days?: number | null
          product_id: string
          shipping_time_days?: number | null
          total_lead_time_days?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          manufacturing_time_days?: number | null
          procurement_time_days?: number | null
          product_id?: string
          shipping_time_days?: number | null
          total_lead_time_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_time_variance_log: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_sent: boolean | null
          detected_at: string
          id: string
          location_id: string
          ltaf_triggered: boolean | null
          ltaf_value: number | null
          new_lead_time: number
          notes: string | null
          previous_lead_time: number
          product_id: string
          variance_pct: number
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_sent?: boolean | null
          detected_at?: string
          id?: string
          location_id: string
          ltaf_triggered?: boolean | null
          ltaf_value?: number | null
          new_lead_time: number
          notes?: string | null
          previous_lead_time: number
          product_id: string
          variance_pct: number
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_sent?: boolean | null
          detected_at?: string
          id?: string
          location_id?: string
          ltaf_triggered?: boolean | null
          ltaf_value?: number | null
          new_lead_time?: number
          notes?: string | null
          previous_lead_time?: number
          product_id?: string
          variance_pct?: number
        }
        Relationships: []
      }
      location_hierarchy: {
        Row: {
          buffer_strategy: string
          created_at: string
          echelon_level: number
          echelon_type: string
          id: string
          is_active: boolean | null
          location_id: string
          parent_location_id: string | null
          updated_at: string
        }
        Insert: {
          buffer_strategy?: string
          created_at?: string
          echelon_level: number
          echelon_type: string
          id?: string
          is_active?: boolean | null
          location_id: string
          parent_location_id?: string | null
          updated_at?: string
        }
        Update: {
          buffer_strategy?: string
          created_at?: string
          echelon_level?: number
          echelon_type?: string
          id?: string
          is_active?: boolean | null
          location_id?: string
          parent_location_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_hierarchy_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "execution_priority_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "inventory_planning_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "location_master"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "execution_priority_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "location_hierarchy_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["location_id"]
          },
        ]
      }
      location_master: {
        Row: {
          channel_id: string | null
          created_at: string | null
          daily_sales_volume: number | null
          demographic_profile: string | null
          drive_thru: boolean | null
          location_id: string
          location_type: string | null
          operating_hours: Json | null
          region: string | null
          restaurant_number: string | null
          seating_capacity: number | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          daily_sales_volume?: number | null
          demographic_profile?: string | null
          drive_thru?: boolean | null
          location_id: string
          location_type?: string | null
          operating_hours?: Json | null
          region?: string | null
          restaurant_number?: string | null
          seating_capacity?: number | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          daily_sales_volume?: number | null
          demographic_profile?: string | null
          drive_thru?: boolean | null
          location_id?: string
          location_type?: string | null
          operating_hours?: Json | null
          region?: string | null
          restaurant_number?: string | null
          seating_capacity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      manual_overrides: {
        Row: {
          ai_recommendation: string
          created_at: string | null
          created_by: string | null
          id: string
          justification: string
          location_id: string
          override_type: string
          planner_decision: string
          product_id: string
        }
        Insert: {
          ai_recommendation: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          justification: string
          location_id: string
          override_type: string
          planner_decision: string
          product_id: string
        }
        Update: {
          ai_recommendation?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          justification?: string
          location_id?: string
          override_type?: string
          planner_decision?: string
          product_id?: string
        }
        Relationships: []
      }
      menu_mapping: {
        Row: {
          created_at: string | null
          criticality_score: number
          id: string
          is_core_item: boolean
          menu_items_count: number
          product_id: string
          sales_impact_percentage: number
          sku: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          criticality_score?: number
          id?: string
          is_core_item?: boolean
          menu_items_count?: number
          product_id: string
          sales_impact_percentage?: number
          sku: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          criticality_score?: number
          id?: string
          is_core_item?: boolean
          menu_items_count?: number
          product_id?: string
          sales_impact_percentage?: number
          sku?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      moq_data: {
        Row: {
          avg_daily_demand: number
          created_at: string | null
          days_coverage: number | null
          id: string
          moq_rigidity_score: number
          moq_units: number
          product_id: string
          sku: string
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          avg_daily_demand?: number
          created_at?: string | null
          days_coverage?: number | null
          id?: string
          moq_rigidity_score?: number
          moq_units?: number
          product_id: string
          sku: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avg_daily_demand?: number
          created_at?: string | null
          days_coverage?: number | null
          id?: string
          moq_rigidity_score?: number
          moq_units?: number
          product_id?: string
          sku?: string
          supplier_id?: string | null
          updated_at?: string | null
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
      product_bom: {
        Row: {
          bom_level: number
          child_product_id: string
          created_at: string | null
          id: string
          operation_sequence: number | null
          parent_product_id: string
          quantity_per: number
          updated_at: string | null
        }
        Insert: {
          bom_level: number
          child_product_id: string
          created_at?: string | null
          id?: string
          operation_sequence?: number | null
          parent_product_id: string
          quantity_per: number
          updated_at?: string | null
        }
        Update: {
          bom_level?: number
          child_product_id?: string
          created_at?: string | null
          id?: string
          operation_sequence?: number | null
          parent_product_id?: string
          quantity_per?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["child_product_id"]
            isOneToOne: false
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["child_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["child_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["child_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["child_product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["product_id"]
          },
        ]
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
      product_cost_components: {
        Row: {
          created_at: string | null
          id: string
          labor_cost: number | null
          material_cost: number | null
          overhead_cost: number | null
          product_id: string
          total_unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          labor_cost?: number | null
          material_cost?: number | null
          overhead_cost?: number | null
          product_id: string
          total_unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          labor_cost?: number | null
          material_cost?: number | null
          overhead_cost?: number | null
          product_id?: string
          total_unit_cost?: number | null
          updated_at?: string | null
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
          preparation_time_minutes: number | null
          product_family: string | null
          product_id: string
          product_type: string | null
          shelf_life_days: number | null
          sku: string
          storage_temp_max: number | null
          storage_temp_min: number | null
          subcategory: string | null
          supplier_id: string | null
          unit_of_measure: string | null
          updated_at: string | null
        }
        Insert: {
          buffer_profile_id?: string | null
          category?: string | null
          created_at?: string | null
          name: string
          notes?: string | null
          planning_priority?: string | null
          preparation_time_minutes?: number | null
          product_family?: string | null
          product_id?: string
          product_type?: string | null
          shelf_life_days?: number | null
          sku: string
          storage_temp_max?: number | null
          storage_temp_min?: number | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_of_measure?: string | null
          updated_at?: string | null
        }
        Update: {
          buffer_profile_id?: string | null
          category?: string | null
          created_at?: string | null
          name?: string
          notes?: string | null
          planning_priority?: string | null
          preparation_time_minutes?: number | null
          product_family?: string | null
          product_id?: string
          product_type?: string | null
          shelf_life_days?: number | null
          sku?: string
          storage_temp_max?: number | null
          storage_temp_min?: number | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_of_measure?: string | null
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
          },
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
      sales_pattern_config: {
        Row: {
          config_key: string
          config_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          multiplier: number
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          multiplier?: number
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          multiplier?: number
          updated_at?: string | null
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
      storage_requirements: {
        Row: {
          cartons_per_pallet: number
          created_at: string | null
          cubic_meters_per_unit: number
          id: string
          product_id: string
          sku: string
          storage_footprint_per_1000_units: number | null
          storage_intensity_score: number
          storage_type: string
          units_per_carton: number
          updated_at: string | null
        }
        Insert: {
          cartons_per_pallet?: number
          created_at?: string | null
          cubic_meters_per_unit?: number
          id?: string
          product_id: string
          sku: string
          storage_footprint_per_1000_units?: number | null
          storage_intensity_score?: number
          storage_type: string
          units_per_carton?: number
          updated_at?: string | null
        }
        Update: {
          cartons_per_pallet?: number
          created_at?: string | null
          cubic_meters_per_unit?: number
          id?: string
          product_id?: string
          sku?: string
          storage_footprint_per_1000_units?: number | null
          storage_intensity_score?: number
          storage_type?: string
          units_per_carton?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_contracts: {
        Row: {
          contract_end_date: string | null
          contract_id: string
          contract_start_date: string
          created_at: string | null
          lead_time_days: number
          minimum_order_qty: number | null
          payment_terms: string | null
          product_id: string
          supplier_id: string
          unit_cost: number
          updated_at: string | null
        }
        Insert: {
          contract_end_date?: string | null
          contract_id?: string
          contract_start_date: string
          created_at?: string | null
          lead_time_days: number
          minimum_order_qty?: number | null
          payment_terms?: string | null
          product_id: string
          supplier_id: string
          unit_cost: number
          updated_at?: string | null
        }
        Update: {
          contract_end_date?: string | null
          contract_id?: string
          contract_start_date?: string
          created_at?: string | null
          lead_time_days?: number
          minimum_order_qty?: number | null
          payment_terms?: string | null
          product_id?: string
          supplier_id?: string
          unit_cost?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_lead_time_history: {
        Row: {
          actual_delivery_date: string | null
          actual_lead_time_days: number | null
          created_at: string | null
          id: string
          on_time: boolean | null
          order_date: string
          product_id: string
          promised_delivery_date: string
          promised_lead_time_days: number | null
          supplier_id: string
        }
        Insert: {
          actual_delivery_date?: string | null
          actual_lead_time_days?: number | null
          created_at?: string | null
          id?: string
          on_time?: boolean | null
          order_date: string
          product_id: string
          promised_delivery_date: string
          promised_lead_time_days?: number | null
          supplier_id: string
        }
        Update: {
          actual_delivery_date?: string | null
          actual_lead_time_days?: number | null
          created_at?: string | null
          id?: string
          on_time?: boolean | null
          order_date?: string
          product_id?: string
          promised_delivery_date?: string
          promised_lead_time_days?: number | null
          supplier_id?: string
        }
        Relationships: []
      }
      supplier_performance: {
        Row: {
          alternate_suppliers_count: number | null
          created_at: string | null
          last_updated: string | null
          on_time_delivery_rate: number | null
          quality_reject_rate: number | null
          quality_score: number | null
          reliability_score: number | null
          supplier_id: string
        }
        Insert: {
          alternate_suppliers_count?: number | null
          created_at?: string | null
          last_updated?: string | null
          on_time_delivery_rate?: number | null
          quality_reject_rate?: number | null
          quality_score?: number | null
          reliability_score?: number | null
          supplier_id: string
        }
        Update: {
          alternate_suppliers_count?: number | null
          created_at?: string | null
          last_updated?: string | null
          on_time_delivery_rate?: number | null
          quality_reject_rate?: number | null
          quality_score?: number | null
          reliability_score?: number | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_performance_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: true
            referencedRelation: "vendor_master"
            referencedColumns: ["vendor_id"]
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
      usage_analysis: {
        Row: {
          avg_weekly_usage: number
          created_at: string | null
          id: string
          location_id: string
          percentage_of_total_usage: number
          product_id: string
          sku: string
          updated_at: string | null
          volume_score: number
        }
        Insert: {
          avg_weekly_usage?: number
          created_at?: string | null
          id?: string
          location_id: string
          percentage_of_total_usage?: number
          product_id: string
          sku: string
          updated_at?: string | null
          volume_score?: number
        }
        Update: {
          avg_weekly_usage?: number
          created_at?: string | null
          id?: string
          location_id?: string
          percentage_of_total_usage?: number
          product_id?: string
          sku?: string
          updated_at?: string | null
          volume_score?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      warehouse_cost_structure: {
        Row: {
          created_at: string | null
          id: string
          labor_cost_monthly: number | null
          location_id: string
          rent_per_sqm_monthly: number | null
          total_storage_sqm: number | null
          updated_at: string | null
          utilities_cost_monthly: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          labor_cost_monthly?: number | null
          location_id: string
          rent_per_sqm_monthly?: number | null
          total_storage_sqm?: number | null
          updated_at?: string | null
          utilities_cost_monthly?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          labor_cost_monthly?: number | null
          location_id?: string
          rent_per_sqm_monthly?: number | null
          total_storage_sqm?: number | null
          updated_at?: string | null
          utilities_cost_monthly?: number | null
        }
        Relationships: []
      }
      zone_adjustment_factor: {
        Row: {
          created_at: string
          end_date: string
          location_id: string
          product_id: string
          reason: string | null
          start_date: string
          zaf: number
        }
        Insert: {
          created_at?: string
          end_date: string
          location_id: string
          product_id: string
          reason?: string | null
          start_date: string
          zaf?: number
        }
        Update: {
          created_at?: string
          end_date?: string
          location_id?: string
          product_id?: string
          reason?: string | null
          start_date?: string
          zaf?: number
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
            referencedRelation: "execution_priority_view"
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
            referencedRelation: "execution_priority_view"
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
      buffer_status_summary: {
        Row: {
          blue_count: number | null
          green_count: number | null
          red_count: number | null
          total_count: number | null
          yellow_count: number | null
        }
        Relationships: []
      }
      component_demand_view: {
        Row: {
          buffer_status: string | null
          component_adu: number | null
          component_category: string | null
          component_name: string | null
          component_product_id: string | null
          component_sku: string | null
          demand_cv: number | null
          high_variability: boolean | null
          location_id: string | null
          mean_demand: number | null
          nfp: number | null
          num_finished_goods_using: number | null
          on_hand: number | null
          std_dev: number | null
          tog: number | null
          tor: number | null
          total_component_qty: number | null
          toy: number | null
          used_in_finished_goods: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_ddmrp_buffers_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_bom_child_product_id_fkey"
            columns: ["component_product_id"]
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
            referencedRelation: "execution_priority_view"
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
      ddmrp_compliance_summary: {
        Row: {
          avg_compliance_score: number | null
          compliant_count: number | null
          last_test_date: string | null
          non_compliant_count: number | null
          partial_count: number | null
          total_tested: number | null
        }
        Relationships: []
      }
      execution_priority_view: {
        Row: {
          buffer_penetration_pct: number | null
          category: string | null
          critical_alert: boolean | null
          current_oh_alert: boolean | null
          execution_priority: string | null
          green_zone: number | null
          lead_time_days: number | null
          location_id: string | null
          nfp: number | null
          on_hand: number | null
          on_order: number | null
          priority_color: string | null
          product_id: string | null
          product_name: string | null
          projected_oh_alert: boolean | null
          projected_on_hand: number | null
          qualified_demand: number | null
          red_zone: number | null
          sku: string | null
          tog: number | null
          tor: number | null
          toy: number | null
          yellow_zone: number | null
        }
        Relationships: []
      }
      inventory_ddmrp_buffers_view: {
        Row: {
          adu: number | null
          buffer_profile_id: string | null
          buffer_profile_name: string | null
          category: string | null
          channel_id: string | null
          dlt: number | null
          green_zone: number | null
          location_id: string | null
          lt_factor: number | null
          moq: number | null
          order_cycle_days: number | null
          product_id: string | null
          product_name: string | null
          red_zone: number | null
          region: string | null
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
      inventory_net_flow_view: {
        Row: {
          location_id: string | null
          nfp: number | null
          on_hand: number | null
          on_order: number | null
          product_id: string | null
          qualified_demand: number | null
        }
        Relationships: []
      }
      inventory_planning_view: {
        Row: {
          average_daily_usage: number | null
          buffer_profile_id: string | null
          buffer_status: string | null
          category: string | null
          channel_id: string | null
          current_stock_level: number | null
          decoupling_point: boolean | null
          demand_variability: number | null
          green_zone: number | null
          lead_time_days: number | null
          location_id: string | null
          max_stock_level: number | null
          min_order_qty: number | null
          min_stock_level: number | null
          nfp: number | null
          on_hand: number | null
          on_order: number | null
          product_id: string | null
          product_name: string | null
          qualified_demand: number | null
          red_zone: number | null
          region: string | null
          reorder_level: number | null
          rounding_multiple: number | null
          sku: string | null
          subcategory: string | null
          tog: number | null
          tor: number | null
          toy: number | null
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
            referencedRelation: "execution_priority_view"
            referencedColumns: ["product_id"]
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
            referencedRelation: "execution_priority_view"
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
            referencedRelation: "inventory_net_flow_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "historical_sales_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_planning_view"
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
      auto_designate_with_scoring_v2: {
        Args: { p_scenario_name?: string; p_threshold?: number }
        Returns: Json
      }
      auto_trigger_ltaf_on_variance: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      calculate_8factor_weighted_score: {
        Args: { p_location_id: string; p_product_id: string }
        Returns: Json
      }
      calculate_criticality_score: {
        Args: { p_product_id: string }
        Returns: number
      }
      calculate_decoupling_score_v2: {
        Args: {
          p_location_id: string
          p_product_id: string
          p_scenario_name?: string
        }
        Returns: Json
      }
      calculate_holding_cost_score: {
        Args: { p_product_id: string }
        Returns: number
      }
      calculate_lead_time_score: {
        Args: { p_location_id: string; p_product_id: string }
        Returns: number
      }
      calculate_moq_rigidity_score: {
        Args: { p_product_id: string }
        Returns: number
      }
      calculate_storage_intensity_score: {
        Args: { p_product_id: string }
        Returns: number
      }
      calculate_supplier_reliability_score: {
        Args: { p_supplier_id: string }
        Returns: number
      }
      calculate_variability_score: {
        Args: { p_location_id: string; p_product_id: string }
        Returns: number
      }
      calculate_volume_score: {
        Args: { p_location_id: string; p_product_id: string }
        Returns: number
      }
      ddmrp_nightly: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      detect_buffer_breaches: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      detect_lead_time_variance: {
        Args: Record<PropertyKey, never>
        Returns: {
          location_id: string
          ltaf_recommended: number
          new_lt: number
          previous_lt: number
          product_id: string
          variance_pct: number
        }[]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      integrate_forecast_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      populate_demand_history_analysis: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      process_hierarchy_configuration: {
        Args: {
          p_mappings: Json
          p_selected_columns: string[]
          p_table_name: string
        }
        Returns: undefined
      }
      recalculate_buffers_with_adjustments: {
        Args: {
          p_location_id?: string
          p_product_id?: string
          p_triggered_by?: string
        }
        Returns: {
          changes_applied: boolean
          location_id: string
          new_green: number
          new_red: number
          new_yellow: number
          old_green: number
          old_red: number
          old_yellow: number
          product_id: string
        }[]
      }
      refresh_component_demand_view: {
        Args: Record<PropertyKey, never>
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
      validate_buffer_criteria: {
        Args: { p_location_id: string; p_product_id: string }
        Returns: Json
      }
      validate_buffer_decoupling_alignment: {
        Args: { p_location_id: string; p_product_id: string }
        Returns: Json
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
      app_role: "admin" | "planner" | "viewer"
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
      app_role: ["admin", "planner", "viewer"],
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
