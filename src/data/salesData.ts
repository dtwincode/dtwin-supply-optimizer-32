
import { SalesPlan } from "@/types/sales";

export const salesPlansData: SalesPlan[] = [
  {
    id: "1",
    timeframe: {
      startDate: "2024-01-01",
      endDate: "2024-03-31"
    },
    productHierarchy: {
      category: "Electronics",
      subcategory: "Phones",
      sku: "SKU001"
    },
    location: {
      region: "Central Region",
      city: "Riyadh"
    },
    planningValues: {
      targetValue: 1500000,
      confidence: 0.85,
      forecastAccuracy: 0.92
    },
    status: "active",
    lastUpdated: "2024-01-25"
  },
  {
    id: "2",
    timeframe: {
      startDate: "2024-02-01",
      endDate: "2024-04-30"
    },
    productHierarchy: {
      category: "Electronics",
      subcategory: "Laptops",
      sku: "SKU003"
    },
    location: {
      region: "Western Region",
      city: "Jeddah"
    },
    planningValues: {
      targetValue: 2500000,
      confidence: 0.78,
      forecastAccuracy: 0.88
    },
    status: "draft",
    lastUpdated: "2024-01-26"
  }
];

