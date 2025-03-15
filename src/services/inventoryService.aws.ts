
import { rdsClient } from '@/integrations/aws/rds-client';
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
import {
  calculateBufferZones,
  calculateNetFlowPosition,
  calculateBufferPenetration,
  calculatePlanningPriority
} from '@/utils/inventoryUtils';

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

// Get inventory items using AWS RDS
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const data = await rdsClient.query<DBInventoryItem>('SELECT * FROM inventory_data');
    return data.map(mapInventoryItem);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

// Get inventory item by ID using AWS RDS
export const getInventoryItemById = async (id: string): Promise<InventoryItem> => {
  try {
    const data = await rdsClient.query<DBInventoryItem>(
      'SELECT * FROM inventory_data WHERE id = $1',
      [id]
    );
    if (data.length === 0) {
      throw new Error(`Inventory item with id ${id} not found`);
    }
    return mapInventoryItem(data[0]);
  } catch (error) {
    console.error(`Error fetching inventory item with id ${id}:`, error);
    throw error;
  }
};

// Update inventory item using AWS RDS
export const updateInventoryItem = async (item: Partial<InventoryItem> & { id: string }): Promise<InventoryItem> => {
  try {
    // Create SET clause dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    // Add each field that exists in the item to the updates array
    if (item.sku !== undefined) { updates.push(`sku = $${paramCounter++}`); values.push(item.sku); }
    if (item.name !== undefined) { updates.push(`name = $${paramCounter++}`); values.push(item.name); }
    if (item.currentStock !== undefined) { updates.push(`current_stock = $${paramCounter++}`); values.push(item.currentStock); }
    if (item.category !== undefined) { updates.push(`category = $${paramCounter++}`); values.push(item.category); }
    if (item.subcategory !== undefined) { updates.push(`subcategory = $${paramCounter++}`); values.push(item.subcategory); }
    if (item.location !== undefined) { updates.push(`location = $${paramCounter++}`); values.push(item.location); }
    if (item.productFamily !== undefined) { updates.push(`product_family = $${paramCounter++}`); values.push(item.productFamily); }
    if (item.region !== undefined) { updates.push(`region = $${paramCounter++}`); values.push(item.region); }
    if (item.city !== undefined) { updates.push(`city = $${paramCounter++}`); values.push(item.city); }
    if (item.channel !== undefined) { updates.push(`channel = $${paramCounter++}`); values.push(item.channel); }
    if (item.warehouse !== undefined) { updates.push(`warehouse = $${paramCounter++}`); values.push(item.warehouse); }
    if (item.decouplingPointId !== undefined) { updates.push(`decoupling_point_id = $${paramCounter++}`); values.push(item.decouplingPointId); }
    if (item.adu !== undefined) { updates.push(`adu = $${paramCounter++}`); values.push(item.adu); }
    if (item.leadTimeDays !== undefined) { updates.push(`lead_time_days = $${paramCounter++}`); values.push(item.leadTimeDays); }
    if (item.variabilityFactor !== undefined) { updates.push(`variability_factor = $${paramCounter++}`); values.push(item.variabilityFactor); }
    if (item.redZoneSize !== undefined) { updates.push(`red_zone_size = $${paramCounter++}`); values.push(item.redZoneSize); }
    if (item.yellowZoneSize !== undefined) { updates.push(`yellow_zone_size = $${paramCounter++}`); values.push(item.yellowZoneSize); }
    if (item.greenZoneSize !== undefined) { updates.push(`green_zone_size = $${paramCounter++}`); values.push(item.greenZoneSize); }
    if (item.onHand !== undefined) { updates.push(`on_hand = $${paramCounter++}`); values.push(item.onHand); }
    if (item.onOrder !== undefined) { updates.push(`on_order = $${paramCounter++}`); values.push(item.onOrder); }
    if (item.qualifiedDemand !== undefined) { updates.push(`qualified_demand = $${paramCounter++}`); values.push(item.qualifiedDemand); }
    if (item.netFlowPosition !== undefined) { updates.push(`net_flow_position = $${paramCounter++}`); values.push(item.netFlowPosition); }
    if (item.planningPriority !== undefined) { updates.push(`planning_priority = $${paramCounter++}`); values.push(item.planningPriority); }

    // Add updated_at and the item ID
    updates.push(`updated_at = NOW()`);
    values.push(item.id);

    const query = `
      UPDATE inventory_data 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;

    const result = await rdsClient.query<DBInventoryItem>(query, values);
    if (result.length === 0) {
      throw new Error(`Inventory item with id ${item.id} not found`);
    }
    
    return mapInventoryItem(result[0]);
  } catch (error) {
    console.error(`Error updating inventory item with id ${item.id}:`, error);
    throw error;
  }
};

// Create inventory item using AWS RDS
export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  try {
    const columns = [
      'sku', 'name', 'current_stock', 'category', 'subcategory', 'location',
      'product_family', 'region', 'city', 'channel', 'warehouse',
      'decoupling_point_id', 'adu', 'lead_time_days', 'variability_factor',
      'red_zone_size', 'yellow_zone_size', 'green_zone_size',
      'on_hand', 'on_order', 'qualified_demand', 'net_flow_position',
      'planning_priority', 'max_stock', 'min_stock'
    ];
    
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    
    const values = [
      item.sku,
      item.name,
      item.currentStock,
      item.category,
      item.subcategory,
      item.location,
      item.productFamily,
      item.region,
      item.city,
      item.channel,
      item.warehouse,
      item.decouplingPointId,
      item.adu,
      item.leadTimeDays,
      item.variabilityFactor,
      item.redZoneSize,
      item.yellowZoneSize,
      item.greenZoneSize,
      item.onHand,
      item.onOrder,
      item.qualifiedDemand,
      item.netFlowPosition,
      item.planningPriority,
      1000, // max_stock
      0 // min_stock
    ];
    
    const query = `
      INSERT INTO inventory_data (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await rdsClient.query<DBInventoryItem>(query, values);
    return mapInventoryItem(result[0]);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

// Delete inventory item using AWS RDS
export const deleteInventoryItem = async (id: string): Promise<void> => {
  try {
    await rdsClient.query('DELETE FROM inventory_data WHERE id = $1', [id]);
  } catch (error) {
    console.error(`Error deleting inventory item with id ${id}:`, error);
    throw error;
  }
};

// Get buffer profiles using AWS RDS
export const getBufferProfiles = async (): Promise<BufferProfile[]> => {
  try {
    const data = await rdsClient.query<DBBufferProfile>('SELECT * FROM buffer_profiles');
    return data.map(mapBufferProfile);
  } catch (error) {
    console.error('Error fetching buffer profiles:', error);
    throw error;
  }
};

// Get active buffer configuration using AWS RDS
export const getActiveBufferConfig = async (): Promise<BufferFactorConfig> => {
  try {
    const data = await rdsClient.query<DBBufferFactorConfig>(
      'SELECT * FROM buffer_factor_configs WHERE is_active = TRUE LIMIT 1'
    );
    
    if (data.length === 0) {
      throw new Error('No active buffer configuration found');
    }
    
    const config = data[0];
    
    return {
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
      metadata: config.metadata || {}
    };
  } catch (error) {
    console.error('Error fetching active buffer configuration:', error);
    throw error;
  }
};

// Export other functions as needed with RDS implementation

// Additional export for quick access to both clients
export const awsInventoryService = {
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  createInventoryItem,
  deleteInventoryItem,
  getBufferProfiles,
  getActiveBufferConfig
};
