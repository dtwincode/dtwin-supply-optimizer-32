
export interface DecouplingPoint {
  id: string;
  locationId: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  description?: string;
  bufferProfileId: string;
}

export interface DecouplingNode {
  id: string;
  type: 'location' | 'decoupling';
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
}

export interface DecouplingNetwork {
  nodes: DecouplingNode[];
  links: DecouplingLink[];
}
