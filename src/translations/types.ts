
export type Language = 'en' | 'ar';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  [key: string]: Translation;
}

export interface DashboardMetrics {
  title: string;
  subtitle: string;
  metrics: {
    totalRevenue: string;
    averageOrderValue: string;
    conversionRate: string;
    customerRetention: string;
  };
}

export interface FinancialMetrics {
  title: string;
  metrics: {
    revenue: string;
    profit: string;
    expenses: string;
    margins: string;
  };
}

export interface SustainabilityMetrics {
  title: string;
  metrics: {
    carbonFootprint: string;
    wasteReduction: string;
    renewableEnergy: string;
    waterConservation: string;
  };
}

export interface ModulesSummary {
  title: string;
  modules: {
    inventory: string;
    forecasting: string;
    marketing: string;
    sales: string;
  };
}

export interface ExecutiveSummary {
  title: string;
  content: string;
}

export interface CommonTranslations {
  actions: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    back: string;
    next: string;
  };
  status: {
    loading: string;
    success: string;
    error: string;
    empty: string;
  };
}

export interface UITranslations {
  buttons: {
    submit: string;
    reset: string;
    search: string;
    filter: string;
    export: string;
    import: string;
  };
  form: {
    required: string;
    invalid: string;
    success: string;
  };
}

export interface PaginationTranslations {
  previous: string;
  next: string;
  showing: string;
  of: string;
  items: string;
  perPage: string;
}

export interface InventoryTranslations {
  title: string;
  metrics: {
    inStock: string;
    outOfStock: string;
    lowStock: string;
    overstock: string;
  };
  filters: {
    location: string;
    category: string;
    status: string;
  };
}

export interface MarketingTranslations {
  title: string;
  campaigns: {
    active: string;
    completed: string;
    scheduled: string;
    performance: string;
  };
  metrics: {
    reach: string;
    engagement: string;
    conversion: string;
    roi: string;
  };
}
