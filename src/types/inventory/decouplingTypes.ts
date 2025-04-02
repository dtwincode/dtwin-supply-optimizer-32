
export interface DecouplingPoint {
  id: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  locationId: string;
  bufferProfileId: string;
  description?: string;
  isOverride?: boolean;
}

export interface DecouplingNetwork {
  id: string;
  name: string;
  description?: string;
  nodes: DecouplingPoint[];
  connections: {
    fromId: string;
    toId: string;
    type: string;
    leadTime: number;
  }[];
}
