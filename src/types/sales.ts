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
  quantity: number;
  returnDate: string;
  reason: string;
  condition: 'new' | 'damaged' | 'expired';
  location: {
    region: string;
    city?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  impact: {
    inventory: number;
    forecast: number;
  };
}
