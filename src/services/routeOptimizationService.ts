
import { supabase } from '@/integrations/supabase/client';

export interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  type: 'origin' | 'destination' | 'waypoint';
}

export interface TransportMode {
  id: string;
  name: string;
  speed_kmh: number;
  cost_per_km: number;
  capacity_kg: number;
  capacity_cbm: number; // cubic meters
  emissions_kg_per_km: number;
}

export interface OptimizedRoute {
  id: string;
  name: string;
  total_distance_km: number;
  total_time_hours: number;
  total_cost: number;
  transport_mode: string;
  origin: RoutePoint;
  destination: RoutePoint;
  waypoints: RoutePoint[];
  emissions_kg: number;
  fuel_consumption_liters: number;
  created_at: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface RouteOptimizationParams {
  origin: string;
  destination: string;
  waypoints?: string[];
  transportModeId?: string;
  optimizationCriteria: 'time' | 'cost' | 'emissions';
  departureTime?: string;
  maxTransitTime?: number;
}

// List available transport modes
export const getTransportModes = async (): Promise<TransportMode[]> => {
  try {
    // Since there's no logistics_transport_modes table yet, we'll return mock data
    return [
      {
        id: 'tm-001',
        name: 'Truck (Standard)',
        speed_kmh: 70,
        cost_per_km: 1.2,
        capacity_kg: 15000,
        capacity_cbm: 40,
        emissions_kg_per_km: 0.8
      },
      {
        id: 'tm-002',
        name: 'Train (Container)',
        speed_kmh: 60,
        cost_per_km: 0.8,
        capacity_kg: 70000,
        capacity_cbm: 150,
        emissions_kg_per_km: 0.4
      },
      {
        id: 'tm-003',
        name: 'Ship (Container)',
        speed_kmh: 35,
        cost_per_km: 0.5,
        capacity_kg: 150000,
        capacity_cbm: 300,
        emissions_kg_per_km: 0.3
      },
      {
        id: 'tm-004',
        name: 'Air Freight',
        speed_kmh: 800,
        cost_per_km: 4.5,
        capacity_kg: 20000,
        capacity_cbm: 80,
        emissions_kg_per_km: 2.0
      },
      {
        id: 'tm-005',
        name: 'Last Mile Delivery',
        speed_kmh: 30,
        cost_per_km: 1.8,
        capacity_kg: 1500,
        capacity_cbm: 12,
        emissions_kg_per_km: 0.6
      }
    ];
  } catch (error) {
    console.error('Error fetching transport modes:', error);
    throw error;
  }
};

// Get saved routes
export const getSavedRoutes = async (): Promise<OptimizedRoute[]> => {
  try {
    // Since there's no logistics_optimized_routes table yet, we'll return mock data
    return generateSampleRoutes();
  } catch (error) {
    console.error('Error fetching saved routes:', error);
    return generateSampleRoutes();
  }
};

// Generate an optimized route (would normally call an external service)
export const generateOptimizedRoute = async (params: RouteOptimizationParams): Promise<OptimizedRoute> => {
  try {
    // In a real implementation, this would call a routing service API
    // For now, we'll simulate a response with sample data
    
    // Wait for a simulated API call duration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sampleLocations = [
      {
        id: 'loc-001',
        name: 'Riyadh Warehouse',
        latitude: 24.7136,
        longitude: 46.6753,
        address: 'Industrial Area, Riyadh 12345, Saudi Arabia',
        type: 'origin' as const
      },
      {
        id: 'loc-002',
        name: 'Jeddah Distribution Center',
        latitude: 21.5412,
        longitude: 39.1721,
        address: 'Port Area, Jeddah 54321, Saudi Arabia',
        type: 'waypoint' as const
      },
      {
        id: 'loc-003',
        name: 'Dammam Port',
        latitude: 26.4207,
        longitude: 50.0887,
        address: 'Port Area, Dammam 31411, Saudi Arabia',
        type: 'waypoint' as const
      },
      {
        id: 'loc-004',
        name: 'Mecca Fulfillment Center',
        latitude: 21.3891,
        longitude: 39.8579,
        address: 'Industrial Zone, Mecca 24231, Saudi Arabia',
        type: 'waypoint' as const
      },
      {
        id: 'loc-005',
        name: 'Medina Regional Hub',
        latitude: 24.5247,
        longitude: 39.5692,
        address: 'Logistics Park, Medina 42351, Saudi Arabia',
        type: 'destination' as const
      }
    ];
    
    const originLocation = sampleLocations.find(loc => loc.name === params.origin) || sampleLocations[0];
    const destinationLocation = sampleLocations.find(loc => loc.name === params.destination) || sampleLocations[4];
    
    const transportModes = await getTransportModes();
    const selectedMode = transportModes.find(mode => mode.id === params.transportModeId) || transportModes[0];
    
    // Calculate a straight-line distance (in a real app, use actual route distance)
    const distanceKm = calculateDistance(
      originLocation.latitude, 
      originLocation.longitude,
      destinationLocation.latitude,
      destinationLocation.longitude
    );
    
    const timeHours = distanceKm / selectedMode.speed_kmh;
    const cost = distanceKm * selectedMode.cost_per_km;
    const emissions = distanceKm * selectedMode.emissions_kg_per_km;
    
    const newRoute: OptimizedRoute = {
      id: `route-${Date.now()}`,
      name: `${originLocation.name} to ${destinationLocation.name}`,
      total_distance_km: Math.round(distanceKm * 10) / 10,
      total_time_hours: Math.round(timeHours * 10) / 10,
      total_cost: Math.round(cost * 100) / 100,
      transport_mode: selectedMode.name,
      origin: originLocation,
      destination: destinationLocation,
      waypoints: [],
      emissions_kg: Math.round(emissions * 10) / 10,
      fuel_consumption_liters: Math.round(distanceKm * 0.3 * 10) / 10,
      created_at: new Date().toISOString(),
      status: 'planned'
    };
    
    return newRoute;
  } catch (error) {
    console.error('Error generating optimized route:', error);
    throw error;
  }
};

// Save a generated route
export const saveOptimizedRoute = async (route: OptimizedRoute): Promise<void> => {
  try {
    // Mock implementation - since there's no actual table yet
    // In a real implementation, we would save to Supabase
    console.log('Route saved (mock):', route);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving optimized route:', error);
    throw error;
  }
};

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Sample data generation
const generateSampleRoutes = (): OptimizedRoute[] => {
  const locations = [
    {
      id: 'loc-001',
      name: 'Riyadh Warehouse',
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'Industrial Area, Riyadh 12345, Saudi Arabia',
      type: 'origin' as const
    },
    {
      id: 'loc-002',
      name: 'Jeddah Distribution Center',
      latitude: 21.5412,
      longitude: 39.1721,
      address: 'Port Area, Jeddah 54321, Saudi Arabia',
      type: 'waypoint' as const
    },
    {
      id: 'loc-003',
      name: 'Dammam Port',
      latitude: 26.4207,
      longitude: 50.0887,
      address: 'Port Area, Dammam 31411, Saudi Arabia',
      type: 'waypoint' as const
    },
    {
      id: 'loc-004',
      name: 'Mecca Fulfillment Center',
      latitude: 21.3891,
      longitude: 39.8579,
      address: 'Industrial Zone, Mecca 24231, Saudi Arabia',
      type: 'waypoint' as const
    },
    {
      id: 'loc-005',
      name: 'Medina Regional Hub',
      latitude: 24.5247,
      longitude: 39.5692,
      address: 'Logistics Park, Medina 42351, Saudi Arabia',
      type: 'destination' as const
    }
  ];
  
  return [
    {
      id: 'route-001',
      name: 'Riyadh to Jeddah Standard Route',
      total_distance_km: 949.2,
      total_time_hours: 13.6,
      total_cost: 1139.04,
      transport_mode: 'Truck (Standard)',
      origin: locations[0],
      destination: locations[1],
      waypoints: [],
      emissions_kg: 759.36,
      fuel_consumption_liters: 284.76,
      created_at: '2024-03-15T10:30:00Z',
      status: 'in-progress'
    },
    {
      id: 'route-002',
      name: 'Jeddah to Dammam via Riyadh',
      total_distance_km: 1356.8,
      total_time_hours: 22.6,
      total_cost: 1085.44,
      transport_mode: 'Train (Container)',
      origin: locations[1],
      destination: locations[2],
      waypoints: [locations[0]],
      emissions_kg: 542.72,
      fuel_consumption_liters: 407.04,
      created_at: '2024-03-14T14:15:00Z',
      status: 'planned'
    },
    {
      id: 'route-003',
      name: 'Dammam to Mecca Maritime Route',
      total_distance_km: 1587.3,
      total_time_hours: 45.4,
      total_cost: 793.65,
      transport_mode: 'Ship (Container)',
      origin: locations[2],
      destination: locations[3],
      waypoints: [],
      emissions_kg: 476.19,
      fuel_consumption_liters: 476.19,
      created_at: '2024-03-10T09:45:00Z',
      status: 'completed'
    },
    {
      id: 'route-004',
      name: 'Riyadh to Medina Express',
      total_distance_km: 849.7,
      total_time_hours: 1.1,
      total_cost: 3823.65,
      transport_mode: 'Air Freight',
      origin: locations[0],
      destination: locations[4],
      waypoints: [],
      emissions_kg: 1699.4,
      fuel_consumption_liters: 254.91,
      created_at: '2024-03-08T16:20:00Z',
      status: 'completed'
    }
  ];
};
