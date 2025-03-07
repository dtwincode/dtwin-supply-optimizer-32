
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader, Info } from 'lucide-react';
import { TransportMode, getTransportModes } from '@/services/routeOptimizationService';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TransportModeList = () => {
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransportModes = async () => {
      try {
        setLoading(true);
        const modes = await getTransportModes();
        setTransportModes(modes);
      } catch (error) {
        console.error('Error fetching transport modes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportModes();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transport Modes</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transport Modes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="capacity">
          <TabsList className="mb-4">
            <TabsTrigger value="capacity">Capacity & Cost</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="capacity">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mode</TableHead>
                  <TableHead>Speed (km/h)</TableHead>
                  <TableHead>Cost per km</TableHead>
                  <TableHead>Capacity (kg)</TableHead>
                  <TableHead>Volume (m³)</TableHead>
                  <TableHead>MOQ</TableHead>
                  <TableHead>Max Shipments</TableHead>
                  <TableHead>Emissions (kg/km)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportModes.map((mode) => (
                  <TableRow key={mode.id}>
                    <TableCell className="font-medium">{mode.name}</TableCell>
                    <TableCell>{mode.speed_kmh}</TableCell>
                    <TableCell>${mode.cost_per_km.toFixed(2)}</TableCell>
                    <TableCell>{(mode.capacity_kg / 1000).toFixed(1)} tons</TableCell>
                    <TableCell>{mode.capacity_cbm} m³</TableCell>
                    <TableCell>
                      {mode.moq ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline">
                                {mode.moq} {mode.moq_units}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Minimum Order Quantity</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {mode.max_shipments ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary">
                                {mode.max_shipments}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Maximum shipments per transport</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{mode.emissions_kg_per_km.toFixed(1)} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="performance">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mode</TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          Reliability Score <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p>Reliability score based on on-time delivery performance and carrier reputation. Higher is better.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          Avg Lead Time <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p>Average lead time from order placement to delivery for standard routes.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          Lead Time Variability <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p>Standard deviation in lead time - lower values indicate more consistent delivery times.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>Tracking Quality</TableHead>
                  <TableHead>Damage Rate (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportModes.map((mode) => (
                  <TableRow key={`${mode.id}-performance`}>
                    <TableCell className="font-medium">{mode.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              getReliabilityScore(mode.name) >= 80
                                ? "bg-success"
                                : getReliabilityScore(mode.name) >= 60
                                ? "bg-warning"
                                : "bg-destructive"
                            }`}
                            style={{ width: `${getReliabilityScore(mode.name)}%` }}
                          />
                        </div>
                        <span className="text-sm">{getReliabilityScore(mode.name)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getAverageLeadTime(mode.name)}</TableCell>
                    <TableCell>
                      <Badge variant={getLeadTimeVariabilityVariant(mode.name)}>
                        {getLeadTimeVariability(mode.name)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TrackingQualityBadge mode={mode.name} />
                    </TableCell>
                    <TableCell>{getDamageRate(mode.name)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper functions to provide realistic performance data
const getReliabilityScore = (mode: string): number => {
  const scores: Record<string, number> = {
    'Truck (Standard)': 82,
    'Train (Container)': 78,
    'Ship (Container)': 68,
    'Air Freight': 91,
    'Last Mile Delivery': 75
  };
  return scores[mode] || 70; // Default fallback
};

const getAverageLeadTime = (mode: string): string => {
  const leadTimes: Record<string, string> = {
    'Truck (Standard)': '3-5 days',
    'Train (Container)': '7-10 days',
    'Ship (Container)': '20-30 days',
    'Air Freight': '1-2 days',
    'Last Mile Delivery': '1-2 days'
  };
  return leadTimes[mode] || 'Unknown';
};

const getLeadTimeVariability = (mode: string): string => {
  const variability: Record<string, string> = {
    'Truck (Standard)': 'Medium',
    'Train (Container)': 'Medium',
    'Ship (Container)': 'High',
    'Air Freight': 'Low',
    'Last Mile Delivery': 'Medium'
  };
  return variability[mode] || 'Unknown';
};

const getLeadTimeVariabilityVariant = (mode: string): "default" | "secondary" | "outline" | "destructive" => {
  const variabilityMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    'Low': 'default',
    'Medium': 'secondary',
    'High': 'destructive'
  };
  const variability = getLeadTimeVariability(mode);
  return variabilityMap[variability] || 'outline';
};

const getDamageRate = (mode: string): number => {
  const rates: Record<string, number> = {
    'Truck (Standard)': 1.2,
    'Train (Container)': 0.9,
    'Ship (Container)': 2.1,
    'Air Freight': 0.6,
    'Last Mile Delivery': 2.8
  };
  return rates[mode] || 1.5; // Default fallback
};

const TrackingQualityBadge = ({ mode }: { mode: string }) => {
  const qualityMap: Record<string, { label: string, variant: "default" | "secondary" | "outline" | "destructive" }> = {
    'Truck (Standard)': { label: 'Good', variant: 'default' },
    'Train (Container)': { label: 'Basic', variant: 'secondary' },
    'Ship (Container)': { label: 'Limited', variant: 'outline' },
    'Air Freight': { label: 'Excellent', variant: 'default' },
    'Last Mile Delivery': { label: 'Good', variant: 'default' }
  };
  
  const quality = qualityMap[mode] || { label: 'Unknown', variant: 'outline' };
  
  return (
    <Badge variant={quality.variant}>
      {quality.label}
    </Badge>
  );
};
