
import { 
  Classification, 
  SKUClassification, 
  ReplenishmentData 
} from '@/types/inventory/classificationTypes';

// Mock functions for testing inventory functionality
export const generateMockClassification = (): Classification => {
  const levels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  const categories: Array<'short' | 'medium' | 'long'> = ['short', 'medium', 'long'];
  
  return {
    leadTimeCategory: categories[Math.floor(Math.random() * categories.length)],
    variabilityLevel: levels[Math.floor(Math.random() * levels.length)],
    criticality: levels[Math.floor(Math.random() * levels.length)],
    score: Math.floor(Math.random() * 100)
  };
};

export const generateMockSKUClassification = (sku: string): SKUClassification => {
  return {
    sku,
    classification: generateMockClassification(),
    lastUpdated: new Date().toISOString()
  };
};

export const generateMockReplenishmentData = (sku: string): ReplenishmentData => {
  return {
    sku,
    internalTransferTime: Math.floor(Math.random() * 5) + 1,
    replenishmentLeadTime: Math.floor(Math.random() * 10) + 5,
    totalCycleTime: Math.floor(Math.random() * 15) + 10,
    lastUpdated: new Date().toISOString(),
    locationFrom: `Location-${Math.floor(Math.random() * 10)}`,
    locationTo: `Location-${Math.floor(Math.random() * 10) + 10}`
  };
};

export const calculateBufferSizes = (
  adu: number,
  leadTime: number,
  variabilityFactor: number
) => {
  const redZone = Math.round(adu * leadTime * 0.5);
  const yellowZone = Math.round(adu * leadTime);
  const greenZone = Math.round(adu * leadTime * variabilityFactor);
  
  return {
    redZone,
    yellowZone,
    greenZone,
    totalBuffer: redZone + yellowZone + greenZone
  };
};

export const calculateBufferPenetration = (
  currentStock: number,
  totalBuffer: number
) => {
  if (totalBuffer === 0) return 0;
  const penetration = 100 - (currentStock / totalBuffer) * 100;
  return Math.min(Math.max(0, penetration), 100);
};
