
import { InventoryItem } from "@/types/inventory";

export const inventoryData: InventoryItem[] = [
  {
    id: 1,
    sku: "SKU001",
    name: "iPhone 14 Pro",
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
    bufferPenetration: 75,
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
  {
    id: 2,
    sku: "SKU002",
    name: "Samsung Galaxy S23",
    currentStock: 85,
    bufferZone: "yellow",
    minStock: 40,
    maxStock: 120,
    leadTime: "7 days",
    category: "Electronics",
    subcategory: "Phones",
    lastUpdated: "2024-01-15",
    location: "Warehouse B",
    productFamily: "Mobile Devices",
    region: "Western Region",
    city: "Jeddah",
    channel: "Online",
    warehouse: "Regional DC",
    bufferPenetration: 60,
    netFlow: {
      onHand: 85,
      onOrder: 40,
      qualifiedDemand: 25,
      netFlowPosition: 100,
      avgDailyUsage: 8,
      orderCycle: 7,
      redZone: 25,
      yellowZone: 35,
      greenZone: 45
    },
    decouplingPoint: {
      type: "Make to Stock",
      location: "Regional DC",
      reason: "Medium demand variability",
      variabilityFactor: "Medium demand variability",
      bufferProfile: "Standard"
    }
  },
  {
    id: 3,
    sku: "SKU003",
    name: "MacBook Pro M2",
    currentStock: 30,
    bufferZone: "red",
    minStock: 25,
    maxStock: 100,
    leadTime: "10 days",
    category: "Electronics",
    subcategory: "Laptops",
    lastUpdated: "2024-01-20",
    location: "Warehouse C",
    productFamily: "Computers",
    region: "Eastern Region",
    city: "Dammam",
    channel: "B2B",
    warehouse: "Enterprise DC",
    bufferPenetration: 35,
    netFlow: {
      onHand: 30,
      onOrder: 60,
      qualifiedDemand: 45,
      netFlowPosition: 45,
      avgDailyUsage: 15,
      orderCycle: 10,
      redZone: 45,
      yellowZone: 60,
      greenZone: 75
    },
    decouplingPoint: {
      type: "Make to Order",
      location: "Central DC",
      reason: "High value item",
      variabilityFactor: "Low demand variability",
      bufferProfile: "Premium"
    }
  }
];

