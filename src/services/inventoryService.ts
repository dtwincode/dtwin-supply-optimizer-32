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
import {
  calculateBufferZones as calculateBufferZonesUtil,
  calculateNetFlowPosition as calculateNetFlowPositionUtil,
  calculateBufferPenetration,
  calculatePlanningPriority,
  shouldCreatePurchaseOrder,
  calculateOrderQuantity,
  calculateQualifiedDemand,
  calculateDecoupledLeadTime,
  calculateInventoryHealthMetrics,
  calculateOptimalBufferLevels
} from '@/utils/bufferCalculations';

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
    max_stock: 1000,
    min_stock: 0
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
    max_stock: 1000,
    min_stock: 0
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
  const dbOrder: any = {
    po_number: order.poNumber,
    sku: order.sku,
    quantity: order.quantity,
    created_by: order.createdBy || 'system',
    status: order.status,
    supplier: order.supplier || undefined,
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
  
  return (data || []).map(order => ({
    id: order.id,
    poNumber: order.po_number,
    sku: order.sku,
    quantity: order.quantity,
    createdBy: 'system', // Use default value since created_by doesn't exist in DB
    status: order.status,
    supplier: undefined, // Set as undefined since supplier doesn't exist in DB
    expectedDeliveryDate: undefined, // Set as undefined since expected_delivery_date doesn't exist in DB
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
  await supabase
    .from('buffer_factor_configs')
    .update({ is_active: false })
    .eq('is_active', true);

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
  try {
    const item = await getInventoryItemById(itemId);
    const config = await getActiveBufferConfig();
    
    // Get buffer profile if available
    let bufferProfile: BufferProfile | undefined;
    if (item.decouplingPointId) {
      const decouplingPoint = await getDecouplingPointById(item.decouplingPointId);
      if (decouplingPoint?.bufferProfileId) {
        bufferProfile = await getBufferProfileById(decouplingPoint.bufferProfileId);
      }
    }
    
    let leadTimeFactor = config.mediumLeadTimeFactor;
    if (item.leadTimeDays && item.leadTimeDays <= config.shortLeadTimeThreshold) {
      leadTimeFactor = config.shortLeadTimeFactor;
    } else if (item.leadTimeDays && item.leadTimeDays > config.mediumLeadTimeThreshold) {
      leadTimeFactor = config.longLeadTimeFactor;
    }
    
    // Apply variability factor from profile or default
    const variabilityFactor = getVariabilityFactorValue(bufferProfile?.variabilityFactor) || item.variabilityFactor || 1.0;
    
    // Apply dynamic adjustments if available
    const seasonalityFactor = item.dynamicAdjustments?.seasonality || 1.0;
    const trendFactor = item.dynamicAdjustments?.trend || 1.0;
    const marketStrategyFactor = item.dynamicAdjustments?.marketStrategy || 1.0;
    
    // Calculate combined adjustment factor
    const combinedAdjustmentFactor = seasonalityFactor * trendFactor * marketStrategyFactor;
    
    const redZone = item.adu ? Math.round(item.adu * leadTimeFactor * variabilityFactor * combinedAdjustmentFactor) : 0;
    const yellowZone = item.adu && item.leadTimeDays ? Math.round(item.adu * item.leadTimeDays * config.replenishmentTimeFactor) : 0;
    const greenZone = Math.round(yellowZone * config.greenZoneFactor);
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  } catch (err) {
    console.error('Error calculating buffer zones:', err);
    
    const item = await getInventoryItemById(itemId);
    
    const redZone = item.redZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.33)) : 0);
    const yellowZone = item.yellowZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * item.leadTimeDays) : 0);
    const greenZone = item.greenZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.5)) : 0);
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  }
};

// Helper function to convert variability type to numeric value
function getVariabilityFactorValue(variabilityType?: string): number | undefined {
  if (!variabilityType) return undefined;
  
  switch (variabilityType) {
    case 'high_variability':
      return 1.3;
    case 'medium_variability':
      return 1.0;
    case 'low_variability':
      return 0.7;
    default:
      return undefined;
  }
}

// New function: Get decoupling point by ID
export const getDecouplingPointById = async (id: string): Promise<DecouplingPoint | null> => {
  try {
    const { data, error } = await supabase
      .from('decoupling_points')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return mapDecouplingPoint(data);
  } catch (err) {
    console.error('Error getting decoupling point:', err);
    return null;
  }
};

// New function: Get buffer profile by ID
export const getBufferProfileById = async (id: string): Promise<BufferProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return mapBufferProfile(data);
  } catch (err) {
    console.error('Error getting buffer profile:', err);
    return null;
  }
};

// Calculate net flow position for an item
export const calculateNetFlowPosition = async (itemId: string): Promise<{ onHand: number, onOrder: number, qualifiedDemand: number, netFlowPosition: number }> => {
  try {
    const item = await getInventoryItemById(itemId);
    
    const onHand = item.onHand;
    const onOrder = item.onOrder;
    
    // Apply qualified demand calculation that respects spike thresholds
    const qualifiedDemand = calculateQualifiedDemand(item);
    
    const netFlowPosition = onHand + onOrder - qualifiedDemand;
    
    return { onHand, onOrder, qualifiedDemand, netFlowPosition };
  } catch (err) {
    console.error('Error calculating net flow position:', err);
    return { onHand: 0, onOrder: 0, qualifiedDemand: 0, netFlowPosition: 0 };
  }
};

// New function: Calculate advanced DDMRP metrics for an item
export const calculateAdvancedDDMRPMetrics = async (itemId: string): Promise<{
  bufferZones: { red: number, yellow: number, green: number };
  netFlow: { onHand: number, onOrder: number, qualifiedDemand: number, netFlowPosition: number };
  bufferPenetration: number;
  planningPriority: string;
  inventoryHealth: {
    inventoryTurnsRatio: number;
    bufferHealthAssessment: number;
    leadTimeCompressionIndex: number;
    demandDrivenFillRate: number;
  };
  replenishmentRecommendation: {
    shouldOrder: boolean;
    urgencyLevel: 'normal' | 'expedite' | 'emergency';
    orderQuantity: number;
  };
}> => {
  try {
    const item = await getInventoryItemById(itemId);
    const config = await getActiveBufferConfig();
    
    // Get buffer profile if item has a decoupling point
    let bufferProfile: BufferProfile | undefined;
    if (item.decouplingPointId) {
      const decouplingPoint = await getDecouplingPointById(item.decouplingPointId);
      if (decouplingPoint?.bufferProfileId) {
        bufferProfile = await getBufferProfileById(decouplingPoint.bufferProfileId);
      }
    }
    
    // Calculate buffer zones
    const bufferZones = await calculateBufferZones(itemId);
    
    // Calculate net flow position
    const netFlow = await calculateNetFlowPosition(itemId);
    
    // Calculate buffer penetration
    const bufferPenetration = calculateBufferPenetration(netFlow.netFlowPosition, bufferZones);
    
    // Determine planning priority
    const planningPriority = calculatePlanningPriority(bufferPenetration);
    
    // Calculate inventory health metrics
    const inventoryHealth = calculateInventoryHealthMetrics(item, bufferZones, netFlow.netFlowPosition);
    
    // Calculate replenishment recommendation
    const { shouldOrder, urgencyLevel } = shouldCreatePurchaseOrder(
      netFlow.netFlowPosition, 
      bufferZones,
      item.supplySignals
    );
    
    const orderQuantity = calculateOrderQuantity(
      netFlow.netFlowPosition,
      bufferZones,
      bufferProfile?.moq,
      item.economicOrderQty,
      bufferProfile?.lotSizeFactor
    );
    
    return {
      bufferZones,
      netFlow,
      bufferPenetration,
      planningPriority,
      inventoryHealth,
      replenishmentRecommendation: {
        shouldOrder,
        urgencyLevel,
        orderQuantity
      }
    };
  } catch (err) {
    console.error('Error calculating advanced DDMRP metrics:', err);
    throw err;
  }
};

// New function: Apply buffer recommendations to an item
export const applyBufferRecommendations = async (itemId: string): Promise<InventoryItem> => {
  try {
    const item = await getInventoryItemById(itemId);
    const config = await getActiveBufferConfig();
    
    // Calculate optimal buffer levels
    const optimalBuffers = calculateOptimalBufferLevels(item, config);
    
    // Calculate decoupled lead time
    let bufferProfile;
    if (item.decouplingPointId) {
      const decouplingPoint = await getDecouplingPointById(item.decouplingPointId);
      if (decouplingPoint?.bufferProfileId) {
        bufferProfile = await getBufferProfileById(decouplingPoint.bufferProfileId);
      }
    }
    const decoupledLeadTime = calculateDecoupledLeadTime(item, bufferProfile || undefined);
    
    // Calculate net flow position
    const netFlow = await calculateNetFlowPosition(itemId);
    
    // Calculate buffer zones
    const bufferZones = await calculateBufferZones(itemId);
    
    // Calculate buffer penetration
    const bufferPenetration = calculateBufferPenetration(netFlow.netFlowPosition, bufferZones);
    
    // Determine planning priority
    const planningPriority = calculatePlanningPriority(bufferPenetration);
    
    // Calculate inventory health metrics
    const healthMetrics = calculateInventoryHealthMetrics(item, bufferZones, netFlow.netFlowPosition);
    
    // Apply all calculated values to the item
    const updatedItem: Partial<InventoryItem> & { id: string } = {
      id: item.id,
      redZoneSize: optimalBuffers.optimalRedZone,
      yellowZoneSize: optimalBuffers.optimalYellowZone,
      greenZoneSize: optimalBuffers.optimalGreenZone,
      decoupledLeadTime,
      onHand: item.onHand,
      onOrder: item.onOrder,
      qualifiedDemand: netFlow.qualifiedDemand,
      netFlowPosition: netFlow.netFlowPosition,
      bufferPenetration,
      planningPriority,
      inventoryTurnsRatio: healthMetrics.inventoryTurnsRatio,
      bufferHealthAssessment: healthMetrics.bufferHealthAssessment,
      leadTimeCompressionIndex: healthMetrics.leadTimeCompressionIndex,
      demandDrivenFillRate: healthMetrics.demandDrivenFillRate
    };
    
    // Update the item in the database
    return await updateInventoryItem(updatedItem);
  } catch (err) {
    console.error('Error applying buffer recommendations:', err);
    throw err;
  }
};

// New function: Generate replenishment recommendations for all inventory items
export const generateReplenishmentRecommendations = async (): Promise<{
  itemId: string;
  sku: string;
  name: string;
  bufferPenetration: number;
  planningPriority: string;
  shouldOrder: boolean;
  urgencyLevel: string;
  orderQuantity: number;
}[]> => {
  try {
    const items = await getInventoryItems();
    const recommendations = [];
    
    for (const item of items) {
      const metrics = await calculateAdvancedDDMRPMetrics(item.id);
      
      if (metrics.replenishmentRecommendation.shouldOrder) {
        recommendations.push({
          itemId: item.id,
          sku: item.sku,
          name: item.name,
          bufferPenetration: metrics.bufferPenetration,
          planningPriority: metrics.planningPriority,
          shouldOrder: metrics.replenishmentRecommendation.shouldOrder,
          urgencyLevel: metrics.replenishmentRecommendation.urgencyLevel,
          orderQuantity: metrics.replenishmentRecommendation.orderQuantity
        });
      }
    }
    
    // Sort by urgency level and buffer penetration
    return recommendations.sort((a, b) => {
      // First sort by urgency level
      const urgencyOrder = { 'emergency': 0, 'expedite': 1, 'normal': 2 };
      const urgencyDiff = urgencyOrder[a.urgencyLevel as keyof typeof urgencyOrder] - 
                         urgencyOrder[b.urgencyLevel as keyof typeof urgencyOrder];
      
      if (urgencyDiff !== 0) return urgencyDiff;
      
      // Then sort by buffer penetration (descending)
      return b.bufferPenetration - a.bufferPenetration;
    });
  } catch (err) {
    console.error('Error generating replenishment recommendations:', err);
    throw err;
  }
};

// New function: Generate purchase orders based on recommendations
export const generatePurchaseOrders = async (
  recommendations: {
    itemId: string;
    orderQuantity: number;
  }[]
): Promise<PurchaseOrder[]> => {
  try {
    const createdOrders: PurchaseOrder[] = [];
    
    for (const rec of recommendations) {
      const item = await getInventoryItemById(rec.itemId);
      
      const now = new Date();
      const poNumber = `PO-${item.sku}-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const order = await createPurchaseOrder({
        poNumber,
        sku: item.sku,
        quantity: rec.orderQuantity,
        status: 'draft',
        createdBy: 'system',
        orderDate: now.toISOString()
      });
      
      createdOrders.push(order);
    }
    
    return createdOrders;
  } catch (err) {
    console.error('Error generating purchase orders:', err);
    throw err;
  }
};

// New function: Historical buffer metrics for trending analysis
export const getHistoricalBufferMetrics = async (itemId: string, startDate?: string, endDate?: string): Promise<any[]> => {
  try {
    let query = supabase
      .from('ddmrp_metrics_history')
      .select('*')
      .eq('inventory_item_id', itemId)
      .order('recorded_at', { ascending: false });
    
    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error getting historical buffer metrics:', err);
    return [];
  }
};

// New function: Record buffer metrics history
export const recordBufferMetricsHistory = async (itemId: string, metrics: Record<string, number>): Promise<void> => {
  try {
    const entries = Object.entries(metrics).map(([metricType, metricValue]) => ({
      inventory_item_id: itemId,
      metric_type: metricType,
      metric_value: metricValue,
      recorded_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('ddmrp_metrics_history')
      .insert(entries);
    
    if (error) throw error;
  } catch (err) {
    console.error('Error recording buffer metrics history:', err);
  }
};

// New function: Update all inventory items with calculated DDMRP metrics
export const updateAllInventoryWithDDMRPMetrics = async (): Promise<number> => {
  try {
    const items = await getInventoryItems();
    let updatedCount = 0;
    
    for (const item of items) {
      try {
        await applyBufferRecommendations(item.id);
        updatedCount++;
      } catch (itemErr) {
        console.error(`Error updating DDMRP metrics for item ${item.id}:`, itemErr);
      }
    }
    
    return updatedCount;
  } catch (err) {
    console.error('Error updating all inventory with DDMRP metrics:', err);
    throw err;
  }
};
