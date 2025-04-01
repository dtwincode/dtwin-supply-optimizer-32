
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, AlertTriangle, TrendingUp, BarChart4 } from "lucide-react";
import { InventoryPlanningItem, PlanningMetrics } from "@/types/inventory/planningTypes";
import { fetchInventoryPlanningView, fetchLocations, fetchBufferProfiles } from "@/lib/inventory-planning.service";
import { useToast } from "@/hooks/use-toast";
import { InventoryPlanningTable } from "./InventoryPlanningTable";
import { BufferAnalysisTab } from "./BufferAnalysisTab";
import { DecouplingAnalysisTab } from "./DecouplingAnalysisTab";

export function InventoryPlanningDashboard() {
  const { toast } = useToast();
  const [planningData, setPlanningData] = useState<InventoryPlanningItem[]>([]);
  const [filteredData, setFilteredData] = useState<InventoryPlanningItem[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [bufferProfiles, setBufferProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("planning-data");
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedBufferProfile, setSelectedBufferProfile] = useState("all");
  const [showDecouplingPointsOnly, setShowDecouplingPointsOnly] = useState(false);
  
  // Metrics
  const [metrics, setMetrics] = useState<PlanningMetrics>({
    totalItems: 0,
    decouplingPoints: 0,
    averageLeadTime: 0,
    criticalItems: 0,
    healthyItems: 0,
    warningItems: 0
  });

  // Fetch data on mount and when filters change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch data with filters
        const data = await fetchInventoryPlanningView({
          searchQuery,
          locationId: selectedLocation,
          bufferProfileId: selectedBufferProfile,
          decouplingPointsOnly: showDecouplingPointsOnly
        });
        
        setPlanningData(data);
        setFilteredData(data);
        
        // Calculate metrics
        if (data.length > 0) {
          const decouplingPoints = data.filter(item => item.decoupling_point).length;
          const totalLeadTimeDays = data.reduce((sum, item) => sum + item.lead_time_days, 0);
          const averageLeadTime = data.length > 0 ? Math.round(totalLeadTimeDays / data.length) : 0;
          
          // Mock metrics for buffer status (in a real app, you'd calculate these based on buffer penetration)
          const criticalItems = Math.floor(data.length * 0.2); // 20% critical
          const warningItems = Math.floor(data.length * 0.3); // 30% warning
          const healthyItems = data.length - criticalItems - warningItems;
          
          setMetrics({
            totalItems: data.length,
            decouplingPoints,
            averageLeadTime,
            criticalItems,
            healthyItems,
            warningItems
          });
        }
      } catch (error) {
        console.error("Error loading planning data:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory planning data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchQuery, selectedLocation, selectedBufferProfile, showDecouplingPointsOnly, toast]);

  // Fetch locations and buffer profiles
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const locationData = await fetchLocations();
        const profileData = await fetchBufferProfiles();
        
        setLocations(locationData);
        setBufferProfiles(profileData);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };
    
    loadFilters();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchInventoryPlanningView({
        searchQuery,
        locationId: selectedLocation,
        bufferProfileId: selectedBufferProfile,
        decouplingPointsOnly: showDecouplingPointsOnly
      });
      
      setPlanningData(data);
      setFilteredData(data);
      
      toast({
        title: "Data refreshed",
        description: "Planning data has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh planning data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Planning</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Planning Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.decouplingPoints} decoupling points ({Math.round((metrics.decouplingPoints / metrics.totalItems) * 100) || 0}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Lead Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageLeadTime} days</div>
            <p className="text-xs text-muted-foreground">
              Across all inventory items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Buffer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="text-xs">{metrics.criticalItems} Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="text-xs">{metrics.warningItems} Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="text-xs">{metrics.healthyItems} Healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Products</Label>
              <Input
                id="search"
                placeholder="Search by product ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bufferProfile">Buffer Profile</Label>
              <Select value={selectedBufferProfile} onValueChange={setSelectedBufferProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Select buffer profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  {bufferProfiles.map((profile) => (
                    <SelectItem key={profile} value={profile}>
                      {profile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="decoupling-points"
                checked={showDecouplingPointsOnly}
                onCheckedChange={setShowDecouplingPointsOnly}
              />
              <Label htmlFor="decoupling-points">Decoupling Points Only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="planning-data">Planning Data</TabsTrigger>
          <TabsTrigger value="buffer-analysis">Buffer Analysis</TabsTrigger>
          <TabsTrigger value="decoupling-analysis">Decoupling Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="planning-data">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart4 className="h-5 w-5 mr-2 text-primary" />
                Inventory Planning Table
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <InventoryPlanningTable data={filteredData} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buffer-analysis">
          <BufferAnalysisTab data={filteredData} loading={loading} />
        </TabsContent>
        
        <TabsContent value="decoupling-analysis">
          <DecouplingAnalysisTab data={filteredData} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
