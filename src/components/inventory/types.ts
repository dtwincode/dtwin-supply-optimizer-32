
export interface LeadTimeData {
  id: string;
  sku: string;
  supplier_id: string;
  predicted_lead_time: number;
  confidence_score: number;
  prediction_date: string;
}

export interface LeadTimeAnomaly {
  id: string;
  sku: string;
  anomaly_type: string;
  anomaly_score: number;
  detection_date: string;
}

// Re-export types from classificationTypes directly
export { Classification, SKUClassification, ReplenishmentData } from "@/types/inventory/classificationTypes";
