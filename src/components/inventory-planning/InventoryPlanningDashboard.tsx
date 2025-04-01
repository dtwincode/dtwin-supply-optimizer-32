
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchInventoryPlanningView, fetchLocations, fetchBufferProfiles } from "@/lib/inventory-planning.service";
import { InventoryPlanningItem, InventoryPlanningFilters, BufferZoneData, PlanningMetrics } from "@/types/inventory/planningTypes";
import { Filter, RefreshCw, AlertTriangle, CheckCircle, ArrowRight, LayoutGrid, Table as TableIcon } from "lucide-react";
import { BufferAnalysisTab } from "./BufferAnalysisTab";

export function InventoryPlanningDashboard() {
  const [planningData, setPlanningData] = useState<InventoryPlanningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PlanningMetrics>({
    totalItems: 0,
    decouplingPoints: 0,
    averageLeadTime: 0,
    criticalItems: 0,
    healthyItems: 0,
    warningItems: 0
  });
  const [filters, setFilters] = useState<InventoryPlanningFilters>({
    searchQuery: "",
    selectedLocation: "all",
    selectedBufferProfile: "all",
    showDecouplingPointsOnly: false
  });
  const [locations, setLocations] = useState<string[]>([]);
  const [bufferProfiles, setBufferProfiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'table' | 'buffer-analysis'>('table');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch data with applied filters
        const data = await fetchInventoryPlanningView({
          searchQuery: filters.searchQuery,
          locationId: filters.selectedLocation !== 'all' ? filters.selectedLocation : undefined,
          bufferProfileId: filters.selectedBufferProfile !== 'all' ? filters.selectedBufferProfile : undefined,
          decouplingPointsOnly: filters.showDecouplingPointsOnly
        });
        
        // Fetch available locations and buffer profiles for filter dropdowns
        const locationData = await fetchLocations();
        const profileData = await fetchBufferProfiles();
        
        setPlanningData(data);
        setLocations(locationData);
        setBufferProfiles(profileData);
        
        // Calculate metrics
        calculateMetrics(data);
        
        setError(null);
      } catch (err) {
        console.error("Error loading inventory planning data:", err);
        setError("Failed to load inventory planning data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filters]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchInventoryPlanningView({
        searchQuery: filters.searchQuery,
        locationId: filters.selectedLocation !== 'all' ? filters.selectedLocation : undefined,
        bufferProfileId: filters.selectedBufferProfile !== 'all' ? filters.selectedBufferProfile : undefined,
        decouplingPointsOnly: filters.showDecouplingPointsOnly
      });
      
      setPlanningData(data);
      calculateMetrics(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing inventory planning data:", err);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data: InventoryPlanningItem[]) => {
    const decouplingPoints = data.filter(item => item.decoupling_point).length;
    const totalLeadTime = data.reduce((sum, item) => sum + item.lead_time_days, 0);
    const averageLeadTime = data.length > 0 ? Math.round(totalLeadTime / data.length) : 0;
    
    // Calculate health metrics based on buffer zones
    let criticalItems = 0;
    let warningItems = 0;
    let healthyItems = 0;
    
    data.forEach(item => {
      const bufferStatus = getBufferStatus(item);
      if (bufferStatus === 'critical') criticalItems++;
      else if (bufferStatus === 'warning') warningItems++;
      else healthyItems++;
    });
    
    setMetrics({
      totalItems: data.length,
      decouplingPoints,
      averageLeadTime,
      criticalItems,
      warningItems,
      healthyItems
    });
  };

  const getBufferStatus = (item: InventoryPlanningItem): 'healthy' | 'warning' | 'critical' => {
    const totalBuffer = item.min_stock_level + item.safety_stock;
    const bufferRatio = totalBuffer > 0 ? item.safety_stock / totalBuffer : 0;
    
    if (bufferRatio < 0.3) return 'critical';
    if (bufferRatio < 0.5) return 'warning';
    return 'healthy';
  };

  const calculateBufferZones = (item: InventoryPlanningItem): BufferZoneData => {
    const red = Math.round(item.safety_stock);
    const yellow = Math.round(item.min_stock_level - item.safety_stock);
    const green = Math.round(item.max_stock_level - item.min_stock_level);
    const total = red + yellow + green;
    
    return { red, yellow, green, total };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Planning</h1>
          <p className="text-muted-foreground">
            Optimize inventory levels with buffer management.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search by Product ID</Label>
              <Input
                id="search"
                placeholder="Enter product ID..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={filters.selectedLocation}
                onValueChange={(value) => setFilters({...filters, selectedLocation: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buffer-profile">Buffer Profile</Label>
              <Select
                value={filters.selectedBufferProfile}
                onValueChange={(value) => setFilters({...filters, selectedBufferProfile: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select buffer profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  {bufferProfiles.map(profile => (
                    <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="decoupling-points"
                  checked={filters.showDecouplingPointsOnly}
                  onCheckedChange={(checked) => setFilters({...filters, showDecouplingPointsOnly: checked})}
                />
                <Label htmlFor="decoupling-points">Show decoupling points only</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.decouplingPoints} decoupling points
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Lead Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageLeadTime} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all selected items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Buffer Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm">{metrics.criticalItems}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-sm">{metrics.warningItems}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm">{metrics.healthyItems}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Critical / Warning / Healthy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Buttons */}
      <div className="flex border-b">
        <Button 
          variant={activeTab === 'table' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('table')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          data-state={activeTab === 'table' ? 'active' : 'inactive'}
        >
          <TableIcon className="h-4 w-4 mr-2" />
          Planning Data
        </Button>
        <Button 
          variant={activeTab === 'buffer-analysis' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('buffer-analysis')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          data-state={activeTab === 'buffer-analysis' ? 'active' : 'inactive'}
        >
          <BarChart className="h-4 w-4 mr-2" />
          Buffer Analysis
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'table' && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Planning Items</CardTitle>
              <div className="border rounded-md p-1">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="px-2"
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="px-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8 text-red-500">
                <AlertTriangle className="h-6 w-6 mr-2" />
                {error}
              </div>
            ) : planningData.length === 0 ? (
              <div className="flex justify-center items-center py-8 text-muted-foreground">
                No planning data found with the current filters.
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Lead Time (days)</TableHead>
                      <TableHead>Daily Usage</TableHead>
                      <TableHead>Buffer Profile</TableHead>
                      <TableHead>Min Stock</TableHead>
                      <TableHead>Safety Stock</TableHead>
                      <TableHead>Max Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Decoupling</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planningData.map((item) => {
                      const bufferStatus = getBufferStatus(item);
                      
                      return (
                        <TableRow key={`${item.product_id}-${item.location_id}`}>
                          <TableCell className="font-medium">{item.product_id}</TableCell>
                          <TableCell>{item.location_id}</TableCell>
                          <TableCell>{item.lead_time_days}</TableCell>
                          <TableCell>{item.average_daily_usage}</TableCell>
                          <TableCell>{item.buffer_profile_id}</TableCell>
                          <TableCell>{item.min_stock_level}</TableCell>
                          <TableCell>{item.safety_stock}</TableCell>
                          <TableCell>{item.max_stock_level}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                bufferStatus === 'critical' ? 'destructive' : 
                                bufferStatus === 'warning' ? 'outline' : 'default'
                              }
                              className={bufferStatus === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                            >
                              {bufferStatus === 'critical' ? 'Critical' : 
                               bufferStatus === 'warning' ? 'Warning' : 'Healthy'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.decoupling_point ? (
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                Decoupling Point
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {planningData.map((item) => {
                  const bufferStatus = getBufferStatus(item);
                  const bufferZones = calculateBufferZones(item);
                  
                  return (
                    <Card key={`${item.product_id}-${item.location_id}`} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{item.product_id}</CardTitle>
                            <p className="text-sm text-muted-foreground">{item.location_id}</p>
                          </div>
                          <Badge 
                            variant={
                              bufferStatus === 'critical' ? 'destructive' : 
                              bufferStatus === 'warning' ? 'outline' : 'default'
                            }
                            className={bufferStatus === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                          >
                            {bufferStatus === 'critical' ? 'Critical' : 
                             bufferStatus === 'warning' ? 'Warning' : 'Healthy'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Buffer Profile:</span>
                            <span>{item.buffer_profile_id}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Lead Time:</span>
                            <span>{item.lead_time_days} days</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Daily Usage:</span>
                            <span>{item.average_daily_usage}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Min Stock:</span>
                            <span>{item.min_stock_level}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Safety Stock:</span>
                            <span>{item.safety_stock}</span>
                          </div>
                          <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100 mt-2">
                            <div 
                              className="bg-red-500 h-full" 
                              style={{ width: `${(bufferZones.red / bufferZones.total) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-yellow-500 h-full" 
                              style={{ width: `${(bufferZones.yellow / bufferZones.total) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-green-500 h-full" 
                              style={{ width: `${(bufferZones.green / bufferZones.total) * 100}%` }}
                            ></div>
                          </div>
                          {item.decoupling_point && (
                            <div className="pt-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 w-full flex justify-center">
                                Decoupling Point
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'buffer-analysis' && (
        <BufferAnalysisTab data={planningData} loading={loading} />
      )}
    </div>
  );
}
