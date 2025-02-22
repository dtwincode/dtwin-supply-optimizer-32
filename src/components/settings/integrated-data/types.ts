
export interface IntegratedData {
  id: string;
  date: string;
  actual_value: number;
  sku: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
