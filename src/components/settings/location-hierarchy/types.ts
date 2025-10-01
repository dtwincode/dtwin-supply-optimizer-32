
import type { Json } from "@/integrations/supabase/types";

export interface SavedFile {
  id: string;
  file_name: string;
  original_name: string;
  created_at: string;
  created_by: string | null;
  data: Json;
  hierarchy_type: string;
  file_type?: string | null;
  storage_path?: string | null;
  updated_at?: string;
  selected_columns?: string[];
}
