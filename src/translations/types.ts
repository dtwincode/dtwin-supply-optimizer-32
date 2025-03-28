
export interface translations {
  en: {
    common: CommonTranslations;
    sales: SalesTranslations;
    navigation: NavigationTranslations;
    dashboard: DashboardTranslations;
    utils: UtilsTranslations;
    inventory: InventoryTranslations;
    marketing: MarketingTranslations;
    settings: SettingsTranslations;
  };
  ar: {
    common: CommonTranslations;
    sales: SalesTranslations;
    navigation: NavigationTranslations;
    dashboard: DashboardTranslations;
    utils: UtilsTranslations;
    inventory: InventoryTranslations;
    marketing: MarketingTranslations;
    settings: SettingsTranslations;
  };
}

export interface CommonTranslations {
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  update: string;
  submit: string;
  loading: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  confirm: string;
  next: string;
  previous: string;
  back: string;
  search: string;
  filter: string;
  clear: string;
  all: string;
  none: string;
  select: string;
  logout: string;
  login: string;
  register: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  name: string;
  description: string;
  inventory: InventoryCommonTranslations;
}

export interface NavigationTranslations {
  dashboard: string;
  forecasting: string;
  inventory: string;
  marketing: string;
  sales: string;
  logistics: string;
  reporting: string;
  settings: string;
}

export interface NavigationItems {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export interface DashboardTranslations {
  title: string;
  subtitle: string;
  kpis: {
    title: string;
    inventory: string;
    sales: string;
    forecast: string;
    logistics: string;
  };
}

export interface UtilsTranslations {
  dateTime: {
    today: string;
    yesterday: string;
    tomorrow: string;
    last7Days: string;
    last30Days: string;
    thisMonth: string;
    lastMonth: string;
    custom: string;
  };
}

export interface InventoryTranslations {
  title: string;
  subtitle: string;
  metrics: {
    onHand: string;
    onOrder: string;
    allocated: string;
    available: string;
    stockouts: string;
    overstock: string;
    turnover: string;
  };
}

export interface InventoryCommonTranslations {
  lowStock: string;
  outOfStock: string;
  inStock: string;
  overstock: string;
  onOrder: string;
  allocated: string;
  available: string;
}

export interface SalesTranslations {
  title: string;
  subtitle: string;
  metrics: {
    revenue: string;
    orders: string;
    customers: string;
    avgOrderValue: string;
    returnRate: string;
  };
}

export interface MarketingTranslations {
  title: string;
  subtitle: string;
  metrics: {
    campaigns: string;
    leads: string;
    conversion: string;
    cac: string;
    roi: string;
  };
}

export interface SettingsTranslations {
  title: string;
  subtitle: string;
  tabs: {
    masterData: string;
    historicalData: string;
    settings: string;
  };
  masterData: {
    title: string;
    description: string;
    products: string;
    locations: string;
    vendors: string;
    productHierarchy: string;
    locationHierarchy: string;
  };
  historicalData: {
    title: string;
    description: string;
    sales: string;
    inventory: string;
    leadTime: string;
    replenishment: string;
  };
  upload: {
    title: string;
    description: string;
    button: string;
    dragDrop: string;
    formats: string;
    success: string;
    error: string;
  };
}
