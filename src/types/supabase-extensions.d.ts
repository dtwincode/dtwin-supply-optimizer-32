
import { Database as OriginalDatabase } from "@/integrations/supabase/types";

declare module "@/integrations/supabase/types" {
  interface Database extends OriginalDatabase {
    public: {
      Tables: OriginalDatabase["public"]["Tables"] & {
        buffer_profiles: {
          Row: {
            id: string;
            name: string;
            description: string | null;
            variability_factor: 'low_variability' | 'medium_variability' | 'high_variability';
            lead_time_factor: 'short' | 'medium' | 'long';
            moq: number | null;
            lot_size_factor: number | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            name: string;
            description?: string | null;
            variability_factor?: 'low_variability' | 'medium_variability' | 'high_variability';
            lead_time_factor?: 'short' | 'medium' | 'long';
            moq?: number | null;
            lot_size_factor?: number | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            name?: string;
            description?: string | null;
            variability_factor?: 'low_variability' | 'medium_variability' | 'high_variability';
            lead_time_factor?: 'short' | 'medium' | 'long';
            moq?: number | null;
            lot_size_factor?: number | null;
            created_at?: string;
            updated_at?: string;
          };
        };
      };
      Enums: OriginalDatabase["public"]["Enums"] & {
        module_type: OriginalDatabase["public"]["Enums"]["module_type"] | 'buffer_profiles';
      };
    };
  }
}
