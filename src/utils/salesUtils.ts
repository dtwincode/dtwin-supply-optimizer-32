
import type { ProductReturn } from "@/types/sales";

/**
 * Calculate inventory impact based on return quantity and condition
 * @param quantity Number of returned items
 * @param condition Condition of returned items
 * @returns Number representing inventory impact
 */
export const calculateInventoryImpact = (quantity: number, condition: ProductReturn['condition']): number => {
  // For damaged or expired items, only a portion might be recoverable
  switch (condition) {
    case 'new':
      // New items can be fully restocked
      return quantity;
    case 'damaged':
      // Only a portion of damaged items can be recovered (example: 50%)
      return Math.round(quantity * 0.5);
    case 'expired':
      // Expired items cannot be restocked
      return 0;
    default:
      return quantity;
  }
};

/**
 * Calculate forecast impact based on return data
 * @param quantity Number of returned items
 * @param reason Reason for return
 * @returns Number representing forecast impact (negative values indicate decrease)
 */
export const calculateForecastImpact = (quantity: number, reason: string): number => {
  // Different reasons may have different impacts on future forecasts
  if (reason.toLowerCase().includes('quality') || reason.toLowerCase().includes('defect')) {
    // Quality issues might significantly affect customer confidence
    return Math.round(-quantity * 0.8);
  } else if (reason.toLowerCase().includes('wrong') || reason.toLowerCase().includes('incorrect')) {
    // Wrong item/size/color doesn't affect product demand as much
    return Math.round(-quantity * 0.3);
  } else if (reason.toLowerCase().includes('damaged') || reason.toLowerCase().includes('transit')) {
    // Damaged in transit doesn't affect product demand as much
    return Math.round(-quantity * 0.4);
  } else {
    // Default moderate impact
    return Math.round(-quantity * 0.5);
  }
};

/**
 * Calculate revenue impact based on return data
 * @param quantity Number of returned items
 * @param condition Condition of returned items
 * @returns Number representing revenue impact (negative values indicate loss)
 */
export const calculateRevenueImpact = (quantity: number, condition: ProductReturn['condition']): number => {
  // Simplified calculation - assume average product value of $100
  const avgProductValue = 100;
  
  switch (condition) {
    case 'new':
      // New items can be resold with minimal loss
      return -Math.round(quantity * avgProductValue * 0.1);
    case 'damaged':
      // Damaged items result in higher revenue loss
      return -Math.round(quantity * avgProductValue * 0.7);
    case 'expired':
      // Expired items result in complete revenue loss
      return -Math.round(quantity * avgProductValue);
    default:
      return -Math.round(quantity * avgProductValue * 0.5);
  }
};

/**
 * Calculate recommended next period adjustment based on return data
 * @param quantity Number of returned items
 * @param reason Reason for return
 * @param condition Condition of returned items
 * @returns Percentage adjustment recommendation for next period forecast
 */
export const calculateNextPeriodAdjustment = (
  quantity: number, 
  reason: string,
  condition: ProductReturn['condition']
): number => {
  // Calculate a percentage adjustment based on return quantity and reason
  let baseAdjustment = 0;
  
  // Higher quantities suggest a more significant pattern
  if (quantity > 10) {
    baseAdjustment = -3;
  } else if (quantity > 5) {
    baseAdjustment = -2;
  } else {
    baseAdjustment = -1;
  }
  
  // Adjust based on reason
  if (reason.toLowerCase().includes('quality') || reason.toLowerCase().includes('defect')) {
    baseAdjustment *= 1.5;
  } else if (reason.toLowerCase().includes('wrong') || reason.toLowerCase().includes('incorrect')) {
    baseAdjustment *= 0.5;
  }
  
  // Adjust based on condition (expired or damaged items might indicate more serious issues)
  if (condition === 'expired') {
    baseAdjustment *= 1.2;
  } else if (condition === 'damaged') {
    baseAdjustment *= 1.1;
  }
  
  return Math.round(baseAdjustment);
};

/**
 * Calculate complete impact for a product return
 * @param returnData The product return data
 * @returns Object containing inventory and forecast impact
 */
export const calculateReturnImpact = (returnData: Pick<ProductReturn, 'quantity' | 'condition' | 'reason'>) => {
  const inventoryImpact = calculateInventoryImpact(returnData.quantity, returnData.condition);
  const forecastImpact = calculateForecastImpact(returnData.quantity, returnData.reason);
  const revenueImpact = calculateRevenueImpact(returnData.quantity, returnData.condition);
  const nextPeriodAdjustment = calculateNextPeriodAdjustment(returnData.quantity, returnData.reason, returnData.condition);
  
  return {
    inventory: inventoryImpact,
    forecast: forecastImpact,
    revenue: revenueImpact,
    nextPeriodAdjustment: nextPeriodAdjustment
  };
};

/**
 * Forecast adjustments based on returns history
 * @param returns Array of product returns
 * @param productSku SKU to filter returns for (optional)
 * @returns Percentage adjustment recommendation for forecast
 */
export const getForecastAdjustmentRecommendation = (
  returns: ProductReturn[], 
  productSku?: string
): number => {
  // Filter returns by SKU if provided
  const relevantReturns = productSku 
    ? returns.filter(r => r.productSku === productSku)
    : returns;
  
  if (relevantReturns.length === 0) return 0;
  
  // Calculate return rate
  const totalQuantity = relevantReturns.reduce((sum, r) => sum + r.quantity, 0);
  
  // Simple logic: If return rate is high, recommend reducing forecast
  if (totalQuantity > 20) return -0.15; // 15% reduction
  if (totalQuantity > 10) return -0.08; // 8% reduction
  if (totalQuantity > 5) return -0.05;  // 5% reduction
  
  return -0.02; // Default small reduction
};
