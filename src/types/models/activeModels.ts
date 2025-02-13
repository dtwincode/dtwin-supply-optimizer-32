
export interface ActiveModel {
  id: string;
  model_id: string;
  model_name: string;
  is_running: boolean;
  last_run: string;
  created_at: string;
  updated_at: string;
  product_filters: Record<string, any>;
  model_parameters: Record<string, any>;
}

export type ActiveModelInsert = Omit<ActiveModel, 'id' | 'created_at' | 'updated_at' | 'last_run'>;
