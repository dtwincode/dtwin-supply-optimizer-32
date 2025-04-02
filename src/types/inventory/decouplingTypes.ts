
export interface DecouplingPoint {
  id: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  locationId: string;
  bufferProfileId: string;
  description?: string;
  isOverride?: boolean;
}
