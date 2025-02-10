
export interface ModelParameter {
  name: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  parameters: ModelParameter[];
}
