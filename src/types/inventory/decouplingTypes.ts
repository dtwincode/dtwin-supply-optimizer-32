export interface DecouplingPoint {
  id: string;
  locationId: string;
  name: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  description?: string;
  bufferProfileId?: string;
  leadTimeAdjustment?: number;
  variabilityFactor?: number;
  enableDynamicAdjustment?: boolean;
  minimumOrderQuantity?: number;
  replenishmentStrategy?: 'min-max' | 'top-of-green' | 'top-of-yellow';
  createdAt?: string;
  updatedAt?: string;
}

export interface DecouplingNode {
  id: string;
  type: 'location' | 'decoupling' | 'supplier' | 'customer';
  label: string;
  parentId?: string;
  level: number;
  metadata: Record<string, any>;
  decouplingType?: DecouplingPoint['type'];
}

export interface DecouplingLink {
  source: string;
  target: string;
  label?: string;
  type?: 'material_flow' | 'information_flow';
  metadata?: Record<string, any>;
}

export interface DecouplingNetwork {
  nodes: DecouplingNode[];
  links: DecouplingLink[];
}
