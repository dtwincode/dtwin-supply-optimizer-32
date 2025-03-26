
export interface SalesPlan {
  id: string;
  timeframe: {
    startDate: string;
    endDate: string;
  };
  planType: 'top-down' | 'bottom-up';
  productHierarchy: {
    category: string;
    subcategory?: string;
    sku?: string;
  };
  location: {
    region: string;
    city?: string;
    warehouse?: string;
  };
  planningValues: {
    targetValue: number;
    actualValue?: number;
    confidence: number;
    notes?: string;
  };
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  lastUpdated: string;
  createdBy: string;
}

export interface ProductHierarchy {
  category: string;
  subcategories: {
    name: string;
    skus: string[];
  }[];
}

export interface LocationHierarchy {
  region: string;
  cities: {
    name: string;
    warehouses: string[];
  }[];
}

export interface ProductReturn {
  id: string;
  productSku: string;
  productName?: string;
  quantity: number;
  returnDate: string;
  reason: string;
  condition: 'new' | 'damaged' | 'expired';
  location: {
    region: string;
    city?: string;
    warehouse?: string;
  };
  customer?: {
    id?: string;
    name?: string;
    segment?: string;
  };
  status: 'recorded' | 'processing' | 'analyzed';
  impact: {
    inventory: number;
    forecast: number;
    revenue?: number;
    nextPeriodAdjustment?: number;
  };
  analysisNotes?: string;
  forecastUpdated?: boolean;
  priorityLevel?: 'low' | 'medium' | 'high';
  tags?: string[];
  relatedOrders?: string[];
}
