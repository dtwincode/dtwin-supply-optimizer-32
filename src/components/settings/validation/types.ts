
import type { Database } from "@/types/database";

export interface DataTemplate {
  required_columns: string[];
  optional_columns: string[];
  sample_row: Record<string, string | number>;
}

export interface ValidationRules {
  data_types?: Record<string, string>;
  required_columns: string[];
  constraints?: {
    min_rows?: number;
    max_rows?: number;
    allow_duplicates?: boolean;
  };
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

export interface DataUploadDialogProps {
  module: Database["public"]["Enums"]["module_type"];
  onDataUploaded: () => void;
}
