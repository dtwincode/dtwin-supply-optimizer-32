
export interface IntegratedData {
  id: string;
  date: string;
  actual_value: number;
  sku: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  validation_status?: string;
  source_files?: any[];
  mapping_config?: Record<string, any>;
}
