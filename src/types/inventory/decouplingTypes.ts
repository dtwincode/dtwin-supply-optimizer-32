
export interface DecouplingPoint {
  id: string;
  locationId: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  description?: string;
  bufferProfileId: string;
  // Adding missing properties used in DecouplingPointDialog.tsx
  replenishmentStrategy?: 'min-max' | 'top-of-green' | 'top-of-yellow';
  leadTimeAdjustment?: number;
  variabilityFactor?: number;
  enableDynamicAdjustment?: boolean;
  minimumOrderQuantity?: number;
}

export interface DecouplingNetworkNode {
  id: string;
  label: string;
  type: string;
  decouplingType?: string;
}

export interface DecouplingNetworkLink {
  source: string;
  target: string;
  label?: string;
}

export interface DecouplingNetwork {
  nodes: DecouplingNetworkNode[];
  links: DecouplingNetworkLink[];
}

// Adding missing types used in useDecouplingPoints.ts
export interface DecouplingNode {
  id: string;
  type: string;
  label: string;
  parentId?: string;
  level?: number;
  metadata?: Record<string, any>;
  decouplingType?: string;
}

export interface DecouplingLink {
  source: string;
  target: string;
  label?: string;
}
