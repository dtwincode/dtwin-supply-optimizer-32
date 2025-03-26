
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";

interface Factor {
  id: string;
  weight: number;
  score: number;
}

interface DecouplingRecommendation {
  score: number;
  factors: Record<string, number>;
  decouplingType: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate' | null;
  confidence: number;
}

export const calculateDecouplingRecommendation = (
  locationId: string,
  factors: Factor[]
): DecouplingRecommendation => {
  // Calculate overall score (weighted average)
  let totalWeight = 0;
  let weightedScore = 0;
  
  // Process each factor's contribution
  const factorContributions: Record<string, number> = {};
  
  factors.forEach(factor => {
    const contribution = (factor.weight * factor.score) / 10; // Normalize by max weight
    factorContributions[factor.id] = contribution;
    
    weightedScore += contribution;
    totalWeight += factor.weight;
  });
  
  // Calculate final score (0-100)
  const finalScore = Math.round((weightedScore / totalWeight) * 10);
  
  // Determine recommended decoupling point type based on score patterns
  let recommendedType: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate' | null = null;
  let confidence = 0;
  
  const leadTimeScore = factorContributions['lead_time'] || 0;
  const demandVariability = factorContributions['demand_variability'] || 0;
  const supplyReliability = factorContributions['supply_reliability'] || 0;
  const inventoryCost = factorContributions['inventory_cost'] || 0;
  const customerService = factorContributions['customer_service'] || 0;
  
  // Decision logic for decoupling point type recommendation
  if (finalScore >= 70) {
    // High lead time, high demand variability -> Strategic decoupling point
    if (leadTimeScore > 40 && demandVariability > 35) {
      recommendedType = 'strategic';
      confidence = 85;
    } 
    // High customer service, medium lead time -> Customer order decoupling point
    else if (customerService > 40 && leadTimeScore > 25) {
      recommendedType = 'customer_order';
      confidence = 80;
    }
    // Balance of factors -> Stock point
    else {
      recommendedType = 'stock_point';
      confidence = 75;
    }
  } else if (finalScore >= 40) {
    // Medium scores across the board -> Intermediate decoupling point
    recommendedType = 'intermediate';
    confidence = 65;
  } else {
    // Low scores -> No recommendation
    recommendedType = null;
    confidence = finalScore > 0 ? 50 : 0;
  }
  
  // Location-specific adjustments (could be expanded with more logic)
  if (locationId === 'loc-main-warehouse') {
    // Main warehouses are often good strategic points
    confidence = recommendedType === 'strategic' ? Math.min(confidence + 10, 100) : confidence;
  } else if (locationId === 'loc-distribution-center') {
    // Distribution centers often work well as customer order decoupling points
    confidence = recommendedType === 'customer_order' ? Math.min(confidence + 5, 100) : confidence;
  }
  
  return {
    score: finalScore,
    factors: factorContributions,
    decouplingType: recommendedType,
    confidence: Math.round(confidence)
  };
};

// Function to evaluate an existing decoupling point configuration
export const evaluateDecouplingPointConfiguration = (
  decouplingPoint: DecouplingPoint,
  locationFactors: Record<string, number>
): {
  score: number;
  strengths: string[];
  weaknesses: string[];
  optimizationSuggestions: string[];
} => {
  // Implementation would analyze the configuration and provide feedback
  // This is a placeholder that could be expanded with real logic
  return {
    score: 75,
    strengths: [
      'Well positioned for current demand patterns',
      'Appropriate buffer profile selection'
    ],
    weaknesses: [
      'May not handle seasonal demand spikes',
      'Lead time vulnerability'
    ],
    optimizationSuggestions: [
      'Consider increasing variability factor during peak seasons',
      'Review lead time assumptions quarterly'
    ]
  };
};
