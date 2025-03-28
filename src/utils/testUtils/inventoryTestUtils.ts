import { 
  InventoryItem, 
  BufferZones, 
  Classification, 
  SKUClassification 
} from "@/types/inventory";
import { calculateBufferZones, calculateNetFlowPosition, calculateBufferPenetration } from "@/utils/inventoryUtils";

/**
 * Generates a sample inventory item with customizable parameters
 */
export const generateSampleInventoryItem = (
  overrides: Partial<InventoryItem> = {}
): InventoryItem => {
  // Default values
  const defaultItem: InventoryItem = {
    id: `item-${Math.floor(Math.random() * 1000)}`,
    sku: `SKU${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    name: `Test Product ${Math.floor(Math.random() * 100)}`,
    currentStock: Math.floor(Math.random() * 200),
    category: "Test Category",
    subcategory: "Test Subcategory",
    location: "Test Warehouse",
    productFamily: "Test Family",
    region: "Test Region",
    city: "Test City",
    channel: "Test Channel",
    warehouse: "Test Warehouse",
    onHand: Math.floor(Math.random() * 200),
    onOrder: Math.floor(Math.random() * 100),
    qualifiedDemand: Math.floor(Math.random() * 50),
    netFlowPosition: 0, // This will be calculated
    adu: Math.floor(Math.random() * 20) + 1, // Average Daily Usage
    leadTimeDays: Math.floor(Math.random() * 30) + 1,
    variabilityFactor: 0.8 + (Math.random() * 0.8), // Between 0.8 and 1.6
    bufferPenetration: 0, // This will be calculated
    planningPriority: "Medium"
  };

  // Calculate netFlowPosition based on onHand, onOrder, and qualifiedDemand
  const item = { ...defaultItem, ...overrides };
  
  // Only calculate if not provided in overrides
  if (!overrides.netFlowPosition) {
    item.netFlowPosition = item.onHand + item.onOrder - item.qualifiedDemand;
  }

  return item;
};

/**
 * Generates a set of buffer zones for testing
 */
export const generateBufferZones = async (item: InventoryItem): Promise<BufferZones> => {
  return await calculateBufferZones(item);
};

/**
 * Calculates buffer penetration for an item
 */
export const calculateItemBufferPenetration = async (item: InventoryItem): Promise<number> => {
  const bufferZones = await generateBufferZones(item);
  const netFlowPosition = calculateNetFlowPosition(item);
  return calculateBufferPenetration(netFlowPosition.netFlowPosition, bufferZones);
};

/**
 * Generates a fully prepared inventory item with all calculated fields
 */
export const generateCompleteInventoryItem = async (
  overrides: Partial<InventoryItem> = {}
): Promise<InventoryItem> => {
  const item = generateSampleInventoryItem(overrides);
  
  // Calculate buffer zones
  const bufferZones = await generateBufferZones(item);
  item.redZoneSize = bufferZones.red;
  item.yellowZoneSize = bufferZones.yellow;
  item.greenZoneSize = bufferZones.green;
  
  // Calculate net flow position and buffer penetration
  const netFlow = calculateNetFlowPosition(item);
  item.netFlowPosition = netFlow.netFlowPosition;
  
  const penetration = calculateBufferPenetration(item.netFlowPosition, bufferZones);
  item.bufferPenetration = penetration;
  
  return item;
};

/**
 * Generates a dataset of inventory items for testing
 */
export const generateInventoryDataset = async (count: number = 10): Promise<InventoryItem[]> => {
  const items: InventoryItem[] = [];
  
  for (let i = 0; i < count; i++) {
    // Create some variety in the dataset
    const item = await generateCompleteInventoryItem({
      productFamily: ["Electronics", "Clothing", "Food", "Hardware"][i % 4],
      category: ["Category A", "Category B", "Category C"][i % 3],
      region: ["North", "South", "East", "West", "Central"][i % 5],
      leadTimeDays: [5, 10, 15, 20, 30][i % 5],
      variabilityFactor: [0.8, 1.0, 1.2, 1.5][i % 4]
    });
    
    items.push(item);
  }
  
  return items;
};

/**
 * Generates SKU classifications for testing
 */
export const generateSKUClassifications = (count: number = 5): SKUClassification[] => {
  const leadTimeCategories: Array<'short' | 'medium' | 'long'> = ['short', 'medium', 'long'];
  const variabilityLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  const criticalityLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  
  return Array(count).fill(null).map((_, index) => ({
    sku: `SKU${(1000 + index).toString().padStart(4, '0')}`,
    classification: {
      leadTimeCategory: leadTimeCategories[index % leadTimeCategories.length],
      variabilityLevel: variabilityLevels[index % variabilityLevels.length],
      criticality: criticalityLevels[index % criticalityLevels.length],
      score: 30 + (index * 10) % 70 // Scores between 30 and 100
    },
    lastUpdated: new Date(Date.now() - (index * 86400000)).toISOString() // Staggered dates
  }));
};

/**
 * Generate an inventory test scenario with multiple items and varying status
 */
export const generateInventoryTestScenario = async (): Promise<{
  items: InventoryItem[];
  classifications: SKUClassification[];
}> => {
  // Generate 20 items with varying status (some in red, yellow, green zones)
  const items = await generateInventoryDataset(20);
  
  // Generate 10 classifications
  const classifications = generateSKUClassifications(10);
  
  return { items, classifications };
};
