
import { supabase } from '@/integrations/supabase/client';
import { 
  InventoryItem, 
  BufferProfile, 
  BufferFactorConfig, 
  DecouplingPoint, 
  PurchaseOrder 
} from '@/types/inventory';

// Get inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Get inventory item by ID
export const getInventoryItemById = async (id: string): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Update inventory item
export const updateInventoryItem = async (item: Partial<InventoryItem> & { id: string }): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .update(item)
    .eq('id', item.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Create inventory item
export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete inventory item
export const deleteInventoryItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Buffer Profiles

// Get buffer profiles
export const getBufferProfiles = async (): Promise<BufferProfile[]> => {
  const { data, error } = await supabase
    .from('buffer_profiles')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Create buffer profile
export const createBufferProfile = async (profile: Omit<BufferProfile, 'id'>): Promise<BufferProfile> => {
  const { data, error } = await supabase
    .from('buffer_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update buffer profile
export const updateBufferProfile = async (profile: Partial<BufferProfile> & { id: string }): Promise<BufferProfile> => {
  const { data, error } = await supabase
    .from('buffer_profiles')
    .update(profile)
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete buffer profile
export const deleteBufferProfile = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('buffer_profiles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Decoupling Points

// Get decoupling points
export const getDecouplingPoints = async (): Promise<DecouplingPoint[]> => {
  const { data, error } = await supabase
    .from('decoupling_points')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Create decoupling point
export const createDecouplingPoint = async (point: Omit<DecouplingPoint, 'id'>): Promise<DecouplingPoint> => {
  const { data, error } = await supabase
    .from('decoupling_points')
    .insert(point)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update decoupling point
export const updateDecouplingPoint = async (point: Partial<DecouplingPoint> & { id: string }): Promise<DecouplingPoint> => {
  const { data, error } = await supabase
    .from('decoupling_points')
    .update(point)
    .eq('id', point.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete decoupling point
export const deleteDecouplingPoint = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('decoupling_points')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Purchase Orders

// Create purchase order
export const createPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get purchase orders
export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Buffer Configuration

// Get buffer configuration
export const getBufferFactorConfig = async (): Promise<BufferFactorConfig[]> => {
  const { data, error } = await supabase
    .from('buffer_factor_configs')
    .select('*')
    .eq('isActive', true);

  if (error) throw error;
  return data || [];
};

// Save buffer configuration
export const saveBufferFactorConfig = async (config: Omit<BufferFactorConfig, 'id'>): Promise<BufferFactorConfig> => {
  // First, deactivate all existing config
  await supabase
    .from('buffer_factor_configs')
    .update({ isActive: false })
    .eq('isActive', true);

  // Then create new active config
  const { data, error } = await supabase
    .from('buffer_factor_configs')
    .insert({ ...config, isActive: true })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Calculate buffer zones for an item
export const calculateBufferZones = async (itemId: string): Promise<{ red: number, yellow: number, green: number }> => {
  // In a real application, this would call a server function or API endpoint
  // that applies the DDMRP calculation logic
  
  try {
    const { data, error } = await supabase.rpc('calculate_buffer_zones', { item_id: itemId });
    
    if (error) throw error;
    
    if (data && typeof data === 'object') {
      // Ensure data is correctly typed
      const typedData = data as Record<string, any>;
      return {
        red: typedData.red_zone || 0,
        yellow: typedData.yellow_zone || 0,
        green: typedData.green_zone || 0
      };
    }
    
    // Fallback to mock calculation if no data
    throw new Error('No data returned from calculation function');
  } catch (err) {
    console.error('Error calculating buffer zones:', err);
    
    // Simulate calculation for demo purposes
    const item = await getInventoryItemById(itemId);
    
    const redZone = item.redZoneSize || Math.round(item.adu! * (item.leadTimeDays! * 0.33));
    const yellowZone = item.yellowZoneSize || Math.round(item.adu! * item.leadTimeDays!);
    const greenZone = item.greenZoneSize || Math.round(item.adu! * (item.leadTimeDays! * 0.5));
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  }
};

// Calculate net flow position for an item
export const calculateNetFlowPosition = async (itemId: string): Promise<{ onHand: number, onOrder: number, qualifiedDemand: number, netFlowPosition: number }> => {
  try {
    const item = await getInventoryItemById(itemId);
    
    // In a real app, you would do a more sophisticated calculation
    const onHand = item.onHand;
    const onOrder = item.onOrder;
    const qualifiedDemand = item.qualifiedDemand;
    const netFlowPosition = onHand + onOrder - qualifiedDemand;
    
    return { onHand, onOrder, qualifiedDemand, netFlowPosition };
  } catch (err) {
    console.error('Error calculating net flow position:', err);
    return { onHand: 0, onOrder: 0, qualifiedDemand: 0, netFlowPosition: 0 };
  }
};
