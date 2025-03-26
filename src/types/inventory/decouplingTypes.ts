
export interface DecouplingPoint {
  id: string;
  locationId: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  description?: string;
  bufferProfileId: string;
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
  label: string;
}

export interface DecouplingNetwork {
  nodes: DecouplingNetworkNode[];
  links: DecouplingNetworkLink[];
}
