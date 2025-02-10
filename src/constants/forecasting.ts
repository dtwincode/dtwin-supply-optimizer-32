export const forecastData = [
  { 
    week: "2024-W01", 
    actual: 65, 
    forecast: 62, 
    variance: -3, 
    region: "Central Region", 
    city: "Riyadh", 
    channel: "B2B", 
    warehouse: "Distribution Center NA", 
    category: "Electronics", 
    subcategory: "Smartphones", 
    sku: "IPH-12"
  },
  { week: "2024-W02", actual: 72, forecast: 70, variance: -2, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU", category: "Electronics", subcategory: "Laptops", sku: "LT-HP-1" },
  { week: "2024-W03", actual: 68, forecast: 65, variance: -3, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia", category: "Electronics", subcategory: "Tablets", sku: "TAB-SM-1" },
  { week: "2024-W04", actual: 75, forecast: 78, variance: 3, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA", category: "Electronics", subcategory: "Smartphones", sku: "IPH-13" },
  { week: "2024-W05", actual: 82, forecast: 80, variance: -2, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU", category: "Electronics", subcategory: "Laptops", sku: "LT-DL-1" },
  { week: "2024-W06", actual: 88, forecast: 85, variance: -3, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia", category: "Electronics", subcategory: "Tablets", sku: "TAB-SM-2" },
  { week: "2024-W07", actual: null, forecast: 92, variance: null, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA", category: "Electronics", subcategory: "Smartphones", sku: "IPH-14" },
  { week: "2024-W08", actual: null, forecast: 88, variance: null, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU", category: "Electronics", subcategory: "Laptops", sku: "LT-HP-2" },
  { week: "2024-W09", actual: null, forecast: 85, variance: null, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia", category: "Electronics", subcategory: "Tablets", sku: "TAB-SM-3" },
];

export const forecastingModels = [
  { id: "moving-avg", name: "Moving Average" },
  { id: "exp-smoothing", name: "Exponential Smoothing" },
  { id: "arima", name: "ARIMA" },
  { id: "ml-lstm", name: "Machine Learning (LSTM)" },
];

export const savedScenarios = [
  { id: 1, name: "Base Scenario", model: "moving-avg", horizon: "6m" },
  { id: 2, name: "High Growth", model: "exp-smoothing", horizon: "12m" },
  { id: 3, name: "Conservative", model: "arima", horizon: "3m" },
];

export const regions = [
  "Central Region",
  "Eastern Region",
  "Western Region",
  "Northern Region",
  "Southern Region"
];

export const cities = {
  "Central Region": ["Riyadh", "Al-Kharj", "Al-Qassim"],
  "Eastern Region": ["Dammam", "Al-Khobar", "Dhahran"],
  "Western Region": ["Jeddah", "Mecca", "Medina"],
  "Northern Region": ["Tabuk", "Hail", "Al-Jawf"],
  "Southern Region": ["Abha", "Jizan", "Najran"]
};

export const channelTypes = [
  "B2B",
  "B2C",
  "Wholesale",
  "Online Marketplace",
  "Direct Store",
  "Distribution Center"
];

export const warehouses = [
  "Distribution Center NA",
  "Distribution Center EU",
  "Manufacturing Plant Asia",
  "Regional Warehouse SA"
];

export const marketEventTypes = [
  { value: 'competitor_action', label: 'Competitor Action' },
  { value: 'regulatory_change', label: 'Regulatory Change' },
  { value: 'market_disruption', label: 'Market Disruption' },
  { value: 'technology_change', label: 'Technology Change' },
  { value: 'economic_event', label: 'Economic Event' }
];

export const marketEventCategories = [
  { value: 'pricing', label: 'Pricing Changes' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'promotion', label: 'Promotional Activity' },
  { value: 'distribution', label: 'Distribution Changes' },
  { value: 'merger_acquisition', label: 'Merger & Acquisition' }
];
