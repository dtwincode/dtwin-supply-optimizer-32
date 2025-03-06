import { supabase } from '@/integrations/supabase/client';
import { 
  InventoryItem, 
  BufferProfile, 
  BufferFactorConfig, 
  DecouplingPoint, 
  PurchaseOrder 
} from '@/types/inventory';
import {
  DBInventoryItem,
  DBBufferProfile,
  DBDecouplingPoint,
  DBPurchaseOrder,
  DBBufferFactorConfig
} from '@/types/inventory/databaseTypes';
import { Json } from '@/integrations/supabase/types';

// Helper function to convert DB inventory item to InventoryItem
const mapInventoryItem = (item: DBInventoryItem): InventoryItem => ({
  id: item.id,
  sku: item.sku,
  name: item.name,
  currentStock: item.current_stock,
  category: item.category,
  subcategory: item.subcategory,
  location: item.location,
  productFamily: item.product_family,
  region: item.region,
  city: item.city,
  channel: item.channel,
  warehouse: item.warehouse,
  decouplingPointId: item.decoupling_point_id,
  adu: item.adu,
  leadTimeDays: item.lead_time_days,
  variabilityFactor: item.variability_factor,
  redZoneSize: item.red_zone_size,
  yellowZoneSize: item.yellow_zone_size,
  greenZoneSize: item.green_zone_size,
  onHand: item.on_hand,
  onOrder: item.on_order,
  qualifiedDemand: item.qualified_demand,
  netFlowPosition: item.net_flow_position,
  planningPriority: item.planning_priority
});

// Helper function to convert DB buffer profile to BufferProfile
const mapBufferProfile = (profile: DBBufferProfile): BufferProfile => ({
  id: profile.id,
  name: profile.name,
  description: profile.description,
  variabilityFactor: profile.variability_factor,
  leadTimeFactor: profile.lead_time_factor,
  moq: profile.moq,
  lotSizeFactor: profile.lot_size_factor
});

// Helper function to convert DB decoupling point to DecouplingPoint
const mapDecouplingPoint = (point: DBDecouplingPoint): DecouplingPoint => ({
  id: point.id,
  locationId: point.location_id,
  bufferProfileId: point.buffer_profile_id,
  type: point.type,
  description: point.description
});

// Helper function to convert DB purchase order to PurchaseOrder
const mapPurchaseOrder = (order: DBPurchaseOrder): PurchaseOrder => ({
  id: order.id,
  poNumber: order.po_number,
  sku: order.sku,
  quantity: order.quantity,
  createdBy: order.created_by,
  status: order.status,
  supplier: order.supplier,
  expectedDeliveryDate: order.expected_delivery_date,
  orderDate: order.order_date
});

// Helper function to convert DB buffer factor config to BufferFactorConfig
const mapBufferFactorConfig = (config: any): BufferFactorConfig => ({
  id: config.id,
  shortLeadTimeFactor: config.short_lead_time_factor,
  mediumLeadTimeFactor: config.medium_lead_time_factor,
  longLeadTimeFactor: config.long_lead_time_factor,
  shortLeadTimeThreshold: config.short_lead_time_threshold,
  mediumLeadTimeThreshold: config.medium_lead_time_threshold,
  replenishmentTimeFactor: config.replenishment_time_factor,
  greenZoneFactor: config.green_zone_factor,
  description: config.description,
  isActive: config.is_active,
  industry: config.industry,
  isBenchmarkBased: config.is_benchmark_based,
  metadata: config.metadata
});

// Get inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory_data')
    .select('*');

  if (error) throw error;
  return (data || []).map(mapInventoryItem);
};

// Get inventory item by ID
export const getInventoryItemById = async (id: string): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory_data')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return mapInventoryItem(data);
};

// Update inventory item
export const updateInventoryItem = async (item: Partial<InventoryItem> & { id: string }): Promise<InventoryItem> => {
  // Convert camelCase to snake_case for DB
  const dbItem: Partial<DBInventoryItem> = {
    id: item.id,
    sku: item.sku,
    name: item.name,
    current_stock: item.currentStock,
    category: item.category,
    subcategory: item.subcategory,
    location: item.location,
    product_family: item.productFamily,
    region: item.region,
    city: item.city,
    channel: item.channel,
    warehouse: item.warehouse,
    decoupling_point_id: item.decouplingPointId,
    adu: item.adu,
    lead_time_days: item.leadTimeDays,
    variability_factor: item.variabilityFactor,
    red_zone_size: item.redZoneSize,
    yellow_zone_size: item.yellowZoneSize,
    green_zone_size: item.greenZoneSize,
    on_hand: item.onHand,
    on_order: item.onOrder,
    qualified_demand: item.qualifiedDemand,
    net_flow_position: item.netFlowPosition,
    planning_priority: item.planningPriority,
    max_stock: 1000, // Default value
    min_stock: 0    // Default value
  };

  const { data, error } = await supabase
    .from('inventory_data')
    .update(dbItem)
    .eq('id', item.id)
    .select()
    .single();

  if (error) throw error;
  return mapInventoryItem(data);
};

// Create inventory item
export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  // Convert camelCase to snake_case for DB and add required fields
  const dbItem: any = {
    sku: item.sku,
    name: item.name,
    current_stock: item.currentStock,
    category: item.category,
    subcategory: item.subcategory,
    location: item.location,
    product_family: item.productFamily,
    region: item.region,
    city: item.city,
    channel: item.channel,
    warehouse: item.warehouse,
    decoupling_point_id: item.decouplingPointId,
    adu: item.adu,
    lead_time_days: item.leadTimeDays,
    variability_factor: item.variabilityFactor,
    red_zone_size: item.redZoneSize,
    yellow_zone_size: item.yellowZoneSize,
    green_zone_size: item.greenZoneSize,
    on_hand: item.onHand,
    on_order: item.onOrder,
    qualified_demand: item.qualifiedDemand,
    net_flow_position: item.netFlowPosition,
    planning_priority: item.planningPriority,
    max_stock: 1000, // Default value
    min_stock: 0     // Default value
  };

  const { data, error } = await supabase
    .from('inventory_data')
    .insert(dbItem)
    .select()
    .single();

  if (error) throw error;
  return mapInventoryItem(data);
};

// Delete inventory item
export const deleteInventoryItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('inventory_data')
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
  return (data || []).map(mapBufferProfile);
};

// Create buffer profile
export const createBufferProfile = async (profile: Omit<BufferProfile, 'id'>): Promise<BufferProfile> => {
  // Convert camelCase to snake_case for DB
  const dbProfile: Omit<DBBufferProfile, 'id' | 'created_at' | 'updated_at'> = {
    name: profile.name,
    description: profile.description,
    variability_factor: profile.variabilityFactor,
    lead_time_factor: profile.leadTimeFactor,
    moq: profile.moq,
    lot_size_factor: profile.lotSizeFactor
  };

  const { data, error } = await supabase
    .from('buffer_profiles')
    .insert(dbProfile)
    .select()
    .single();

  if (error) throw error;
  return mapBufferProfile(data);
};

// Update buffer profile
export const updateBufferProfile = async (profile: Partial<BufferProfile> & { id: string }): Promise<BufferProfile> => {
  // Convert camelCase to snake_case for DB
  const dbProfile: Partial<DBBufferProfile> = {
    id: profile.id,
    name: profile.name,
    description: profile.description,
    variability_factor: profile.variabilityFactor,
    lead_time_factor: profile.leadTimeFactor,
    moq: profile.moq,
    lot_size_factor: profile.lotSizeFactor
  };

  const { data, error } = await supabase
    .from('buffer_profiles')
    .update(dbProfile)
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw error;
  return mapBufferProfile(data);
};

// Save buffer profile (create or update)
export const saveBufferProfile = async (profile: BufferProfile): Promise<BufferProfile> => {
  if (profile.id) {
    return updateBufferProfile(profile);
  } else {
    return createBufferProfile(profile);
  }
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
  return (data || []).map(mapDecouplingPoint);
};

// Create decoupling point
export const createDecouplingPoint = async (point: Omit<DecouplingPoint, 'id'>): Promise<DecouplingPoint> => {
  // Convert camelCase to snake_case for DB
  const dbPoint: Omit<DBDecouplingPoint, 'id' | 'created_at' | 'updated_at'> = {
    location_id: point.locationId,
    buffer_profile_id: point.bufferProfileId,
    type: point.type,
    description: point.description
  };

  const { data, error } = await supabase
    .from('decoupling_points')
    .insert(dbPoint)
    .select()
    .single();

  if (error) throw error;
  return mapDecouplingPoint(data);
};

// Update decoupling point
export const updateDecouplingPoint = async (point: Partial<DecouplingPoint> & { id: string }): Promise<DecouplingPoint> => {
  // Convert camelCase to snake_case for DB
  const dbPoint: Partial<DBDecouplingPoint> = {
    id: point.id,
    location_id: point.locationId,
    buffer_profile_id: point.bufferProfileId,
    type: point.type,
    description: point.description
  };

  const { data, error } = await supabase
    .from('decoupling_points')
    .update(dbPoint)
    .eq('id', point.id)
    .select()
    .single();

  if (error) throw error;
  return mapDecouplingPoint(data);
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
  // Convert camelCase to snake_case for DB
  const dbOrder: any = {
    po_number: order.poNumber,
    sku: order.sku,
    quantity: order.quantity,
    created_by: order.createdBy || 'system', // Provide default value
    status: order.status,
    supplier: order.supplier || undefined, // Provide undefined as fallback if supplier doesn't exist
    expected_delivery_date: order.expectedDeliveryDate,
    order_date: order.orderDate
  };

  const { data, error } = await supabase
    .from('purchase_orders')
    .insert(dbOrder)
    .select()
    .single();

  if (error) throw error;
  return mapPurchaseOrder(data);
};

// Get purchase orders
export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*');

  if (error) throw error;
  
  // Handle the case where the data from the database might not have all required fields
  // by providing default values where needed
  const validData = data?.map(item => ({
    ...item,
    // If needed add other defaults here, but don't use created_by directly since it might not exist
  })) || [];
  
  return validData.map(order => ({
    id: order.id,
    poNumber: order.po_number,
    sku: order.sku,
    quantity: order.quantity,
    createdBy: 'system', // Default value since it might be missing in the database
    status: order.status,
    supplier: order.supplier || undefined, // Provide undefined as fallback if supplier doesn't exist
    expectedDeliveryDate: order.expected_delivery_date || undefined, // Provide undefined as fallback
    orderDate: order.order_date
  }));
};

// Buffer Configuration

// Get active buffer configuration
export const getActiveBufferConfig = async (): Promise<BufferFactorConfig> => {
  const { data, error } = await supabase
    .from('buffer_factor_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return mapBufferFactorConfig(data);
};

// Get buffer configuration
export const getBufferFactorConfig = async (): Promise<BufferFactorConfig[]> => {
  const { data, error } = await supabase
    .from('buffer_factor_configs')
    .select('*');

  if (error) throw error;
  return (data || []).map(mapBufferFactorConfig);
};

// Save buffer configuration
export const saveBufferFactorConfig = async (config: Omit<BufferFactorConfig, 'id'>): Promise<BufferFactorConfig> => {
  // First, deactivate all existing config
  await supabase
    .from('buffer_factor_configs')
    .update({ is_active: false })
    .eq('is_active', true);

  // Convert camelCase to snake_case for DB
  const dbConfig: any = {
    short_lead_time_factor: config.shortLeadTimeFactor,
    medium_lead_time_factor: config.mediumLeadTimeFactor,
    long_lead_time_factor: config.longLeadTimeFactor,
    short_lead_time_threshold: config.shortLeadTimeThreshold,
    medium_lead_time_threshold: config.mediumLeadTimeThreshold,
    replenishment_time_factor: config.replenishmentTimeFactor,
    green_zone_factor: config.greenZoneFactor,
    description: config.description,
    is_active: true,
    industry: config.industry,
    is_benchmark_based: config.isBenchmarkBased,
    metadata: config.metadata || {}
  };

  // Then create new active config
  const { data, error } = await supabase
    .from('buffer_factor_configs')
    .insert(dbConfig)
    .select()
    .single();

  if (error) throw error;
  return mapBufferFactorConfig(data);
};

// Calculate buffer zones for an item
export const calculateBufferZones = async (itemId: string): Promise<{ red: number, yellow: number, green: number }> => {
  // In a real application, this would use a stored procedure or remote function
  // For now, we'll use the utility function directly
  try {
    // Manual calculation since we can't call RPC functions directly in this example
    const item = await getInventoryItemById(itemId);
    const config = await getActiveBufferConfig();
    
    // Basic calculations
    let leadTimeFactor = config.mediumLeadTimeFactor;
    if (item.leadTimeDays && item.leadTimeDays <= config.shortLeadTimeThreshold) {
      leadTimeFactor = config.shortLeadTimeFactor;
    } else if (item.leadTimeDays && item.leadTimeDays > config.mediumLeadTimeThreshold) {
      leadTimeFactor = config.longLeadTimeFactor;
    }
    
    const redZone = item.adu ? Math.round(item.adu * leadTimeFactor * (item.variabilityFactor || 1)) : 0;
    const yellowZone = item.adu && item.leadTimeDays ? Math.round(item.adu * item.leadTimeDays * config.replenishmentTimeFactor) : 0;
    const greenZone = Math.round(yellowZone * config.greenZoneFactor);
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  } catch (err) {
    console.error('Error calculating buffer zones:', err);
    
    // Fallback calculation
    const item = await getInventoryItemById(itemId);
    
    const redZone = item.redZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.33)) : 0);
    const yellowZone = item.yellowZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * item.leadTimeDays) : 0);
    const greenZone = item.greenZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.5)) : 0);
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  }
};

// Calculate net flow position for an item
export const calculateNetFlowPosition = async (itemId: string): Promise<{ onHand: number, onOrder: number, qualifiedDemand: number, netFlowPosition: number }> => {
  try {
    const item = await getInventoryItemById(itemId);
    
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
