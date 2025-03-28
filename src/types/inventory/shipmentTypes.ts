
export interface Shipment {
  id: string;
  shipment_number: string;
  sku: string;
  quantity: number;
  customer: string;
  ship_date: string;
  delivery_date?: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  shipping_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  sku: string;
  quantity: number;
  transaction_type: 'inbound' | 'outbound';
  reference_id?: string;
  reference_type?: string;
  previous_on_hand: number;
  new_on_hand: number;
  notes?: string;
  transaction_date: string;
}
