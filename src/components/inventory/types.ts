
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

export interface Classification {
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
}

export interface SKUClassification {
  sku: string;
  classification: Classification;
  lastUpdated: string;
}

export interface ReplenishmentData {
  sku: string;
  internalTransferTime: number;
  replenishmentLeadTime: number;
  totalCycleTime: number;
  lastUpdated: string;
  locationFrom: string;
  locationTo: string;
}
