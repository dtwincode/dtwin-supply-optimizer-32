
import { InventoryItem } from "@/types/inventory";

export const inventoryData: InventoryItem[] = [
  {
    id: 1,
    sku: "SKU001",
    name: "Product 1",
    currentStock: 100,
    bufferZone: "green",
    minStock: 50,
    maxStock: 150,
    leadTime: "5 days",
    category: "Electronics",
    subcategory: "Phones",
    lastUpdated: "2024-01-01",
    location: "Warehouse A",
    productFamily: "Mobile Devices",
    region: "Central Region",
    city: "Riyadh",
    channel: "Retail",
    warehouse: "Main DC",
    netFlow: {
      onHand: 100,
      onOrder: 50,
      qualifiedDemand: 30,
      netFlowPosition: 120,
      avgDailyUsage: 10,
      orderCycle: 7,
      redZone: 30,
      yellowZone: 40,
      greenZone: 50
    },
    decouplingPoint: {
      type: "Make to Stock",
      location: "Regional DC",
      reason: "High demand variability",
      variabilityFactor: "High demand variability",
      bufferProfile: "Standard"
    }
  },
  // Add more sample data as needed
];
