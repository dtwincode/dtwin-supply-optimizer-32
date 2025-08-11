
import type { Json } from "@/integrations/supabase/types";

export interface SavedFile {
  id: string;
  file_name: string;
  original_name: string;
  created_at: string;
  created_by: string;
  data: Json;
  hierarchy_type: string;
  selected_columns: string[];
}
