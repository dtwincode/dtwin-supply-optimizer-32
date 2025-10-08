/**
 * Centralized DDMRP KPI calculations
 * All formulas follow DDMRP standards (Ptak & Smith)
 */

export interface DDMRPMetrics {
  serviceLevel: number;
  fillRate: number;
  inventoryTurnover: number;
  daysOfInventory: number;
  stockoutFrequency: number;
  bufferHealthScore: number;
  otifCompliance: number;
  avgBufferPenetration: number;
}

export interface BufferStatusCounts {
  red: number;
  yellow: number;
  green: number;
  blue: number;
  total: number;
}

/**
 * Calculate Service Level % (items not in RED zone)
 * Formula: (Total Items - RED Items) / Total Items * 100
 */
export const calculateServiceLevel = (items: any[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 0;
  
  const redItems = items.filter(item => item.buffer_status === 'RED').length;
  return ((totalItems - redItems) / totalItems) * 100;
};

/**
 * Calculate Fill Rate % (NFP/TOG ratio)
 * Formula: Average(NFP / TOG) * 100
 */
export const calculateFillRate = (items: any[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 0;
  
  const sumFillRate = items.reduce((sum, item) => {
    if (!item.tog || item.tog === 0) return sum;
    const fillRate = Math.min((item.nfp / item.tog) * 100, 100);
    return sum + fillRate;
  }, 0);
  
  return sumFillRate / totalItems;
};

/**
 * Calculate Inventory Turnover (Annual)
 * Formula: (ADU * 365) / On-Hand Inventory
 */
export const calculateInventoryTurnover = (items: any[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 0;
  
  const sumTurnover = items.reduce((sum, item) => {
    if (!item.on_hand || item.on_hand === 0 || !item.average_daily_usage) return sum;
    const turnover = (item.average_daily_usage * 365) / item.on_hand;
    return sum + turnover;
  }, 0);
  
  return sumTurnover / totalItems;
};

/**
 * Calculate Days of Inventory
 * Formula: On-Hand / ADU
 */
export const calculateDaysOfInventory = (items: any[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 0;
  
  const sumDays = items.reduce((sum, item) => {
    if (!item.average_daily_usage || item.average_daily_usage === 0) return sum;
    const days = item.on_hand / item.average_daily_usage;
    return sum + days;
  }, 0);
  
  return sumDays / totalItems;
};

/**
 * Calculate Stockout Frequency (breaches per item per month)
 * Formula: Total Breaches / Total Items / 30 days
 */
export const calculateStockoutFrequency = (items: any[], breaches: any[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 0;
  
  return (breaches.length / totalItems) / 30;
};

/**
 * Calculate Buffer Health Score
 * Formula: (Green * 100 + Yellow * 60 + Red * 0) / Total Items
 */
export const calculateBufferHealthScore = (items: any[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 0;
  
  const counts = getBufferStatusCounts(items);
  const healthScore = (counts.green * 100 + counts.yellow * 60 + counts.red * 0) / totalItems;
  
  return healthScore;
};

/**
 * Calculate Average Buffer Penetration
 * Formula: Average(NFP / TOG) * 100
 */
export const calculateAvgBufferPenetration = (items: any[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 0;
  
  const sumPenetration = items.reduce((sum, item) => {
    if (!item.tog || item.tog === 0) return sum;
    const penetration = (item.nfp / item.tog) * 100;
    return sum + Math.min(Math.max(penetration, 0), 100);
  }, 0);
  
  return sumPenetration / totalItems;
};

/**
 * Calculate all DDMRP metrics at once
 */
export const calculateAllMetrics = (items: any[], breaches: any[] = []): DDMRPMetrics => {
  return {
    serviceLevel: calculateServiceLevel(items),
    fillRate: calculateFillRate(items),
    inventoryTurnover: calculateInventoryTurnover(items),
    daysOfInventory: calculateDaysOfInventory(items),
    stockoutFrequency: calculateStockoutFrequency(items, breaches),
    bufferHealthScore: calculateBufferHealthScore(items),
    otifCompliance: 0, // Placeholder - requires PO data
    avgBufferPenetration: calculateAvgBufferPenetration(items),
  };
};

/**
 * Get buffer status counts
 */
export const getBufferStatusCounts = (items: any[]): BufferStatusCounts => {
  return {
    red: items.filter(item => item.buffer_status === 'RED').length,
    yellow: items.filter(item => item.buffer_status === 'YELLOW').length,
    green: items.filter(item => item.buffer_status === 'GREEN').length,
    blue: items.filter(item => item.buffer_status === 'BLUE').length,
    total: items.length,
  };
};

/**
 * Calculate buffer penetration for a single item
 */
export const calculateItemPenetration = (item: any): number => {
  if (!item.nfp || !item.tog || item.tog === 0) return 0;
  return Math.round((item.nfp / item.tog) * 100);
};
