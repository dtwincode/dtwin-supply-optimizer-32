
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, TrendingUp, RefreshCw, Search, Map, SlidersHorizontal, Tags, X } from "lucide-react";
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

export const LogisticsFilters = () => {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryTimeRange, setDeliveryTimeRange] = useState([1, 7]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [costRange, setCostRange] = useState([50, 500]);
  
  // Additional filter options
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("all");
  const [isInternational, setIsInternational] = useState(false);
  const [hasClearance, setHasClearance] = useState(false);
  const [hasSpecialHandling, setHasSpecialHandling] = useState(false);

  const handleFilterChange = (filter: string, value: any) => {
    // Update the specific filter
    switch (filter) {
      case 'carrier':
        setCarrierFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'priority':
        setSelectedPriority(value);
        break;
      case 'region':
        setSelectedRegion(value);
        break;
      case 'shipping_method':
        setSelectedShippingMethod(value);
        break;
      case 'is_international':
        setIsInternational(value);
        break;
      case 'has_clearance':
        setHasClearance(value);
        break;
      case 'has_special_handling':
        setHasSpecialHandling(value);
        break;
    }
    
    // Update active filters list for display
    if (value && value !== 'all' && value !== false) {
      if (!activeFilters.includes(filter)) {
        setActiveFilters([...activeFilters, filter]);
      }
    } else {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    }
  };

  const clearAllFilters = () => {
    setCarrierFilter("all");
    setStatusFilter("all");
    setDate(undefined);
    setSearchQuery("");
    setDeliveryTimeRange([1, 7]);
    setSelectedPriority("all");
    setSelectedRegion("all");
    setSelectedShippingMethod("all");
    setIsInternational(false);
    setHasClearance(false);
    setHasSpecialHandling(false);
    setCostRange([50, 500]);
    setActiveFilters([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={getTranslation('common.logistics.searchPlaceholder', language) || "Search orders, carriers..."}
            className="w-[200px] pl-8 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={statusFilter}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder={getTranslation('common.logistics.filterByStatus', language) || "Filter by Status"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getTranslation('common.logistics.allStatuses', language) || "All Statuses"}</SelectItem>
            <SelectItem value="in-transit">{getTranslation('common.logistics.inTransit', language) || "In Transit"}</SelectItem>
            <SelectItem value="delivered">{getTranslation('common.logistics.delivered', language) || "Delivered"}</SelectItem>
            <SelectItem value="processing">{getTranslation('common.logistics.processing', language) || "Processing"}</SelectItem>
            <SelectItem value="out-for-delivery">{getTranslation('common.logistics.outForDelivery', language) || "Out for Delivery"}</SelectItem>
            <SelectItem value="delayed">{getTranslation('common.logistics.delayed', language) || "Delayed"}</SelectItem>
            <SelectItem value="exception">{getTranslation('common.logistics.exception', language) || "Exception"}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={carrierFilter}
          onValueChange={(value) => handleFilterChange('carrier', value)}
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder={getTranslation('common.logistics.filterByCarrier', language) || "Filter by Carrier"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getTranslation('common.logistics.allCarriers', language) || "All Carriers"}</SelectItem>
            <SelectItem value="saudi-post">{getTranslation('common.logistics.carriers.saudiPost', language) || "Saudi Post"}</SelectItem>
            <SelectItem value="smsa">{getTranslation('common.logistics.carriers.smsa', language) || "SMSA Express"}</SelectItem>
            <SelectItem value="aramex">{getTranslation('common.logistics.carriers.aramex', language) || "Aramex"}</SelectItem>
            <SelectItem value="dhl">{getTranslation('common.logistics.carriers.dhl', language) || "DHL"}</SelectItem>
            <SelectItem value="fedex">{getTranslation('common.logistics.carriers.fedex', language) || "FedEx"}</SelectItem>
            <SelectItem value="ups">{getTranslation('common.logistics.carriers.ups', language) || "UPS"}</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white border-gray-200 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {date ? format(date, "PPP") : (getTranslation('common.logistics.filterByDate', language) || "Filter by Date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(date) => handleFilterChange('date', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant={showAdvancedFilters ? "default" : "outline"} 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {getTranslation('common.logistics.advancedFilters', language) || "Advanced Filters"}
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-1">{activeFilters.length}</Badge>
          )}
        </Button>
        
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-destructive hover:text-destructive/90"
          >
            {getTranslation('common.logistics.clearFilters', language) || "Clear Filters"}
          </Button>
        )}
        
        <div className="ml-auto flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full bg-white" title={getTranslation('common.logistics.mapView', language) || "Map View"}>
                <Map className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    {getTranslation('common.logistics.mapViewSettings', language) || "Map View Settings"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getTranslation('common.logistics.mapViewDescription', language) || "Customize how shipments are displayed on the map."}
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-routes" />
                    <label htmlFor="show-routes" className="text-sm">
                      {getTranslation('common.logistics.showRoutes', language) || "Show Routes"}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-heatmap" />
                    <label htmlFor="show-heatmap" className="text-sm">
                      {getTranslation('common.logistics.showHeatmap', language) || "Show Delivery Density Heatmap"}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cluster-markers" defaultChecked />
                    <label htmlFor="cluster-markers" className="text-sm">
                      {getTranslation('common.logistics.clusterMarkers', language) || "Cluster Nearby Markers"}
                    </label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            title={getTranslation('common.logistics.refreshData', language) || "Refresh Data"}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            title={getTranslation('common.logistics.analyticsView', language) || "Analytics View"}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showAdvancedFilters && (
        <div className="p-4 border rounded-md bg-white shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {getTranslation('common.logistics.priority', language) || "Priority"}
              </label>
              <Select 
                value={selectedPriority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getTranslation('common.logistics.selectPriority', language) || "Select Priority"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{getTranslation('common.logistics.allPriorities', language) || "All Priorities"}</SelectItem>
                  <SelectItem value="high">{getTranslation('common.logistics.highPriority', language) || "High"}</SelectItem>
                  <SelectItem value="medium">{getTranslation('common.logistics.mediumPriority', language) || "Medium"}</SelectItem>
                  <SelectItem value="low">{getTranslation('common.logistics.lowPriority', language) || "Low"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {getTranslation('common.logistics.region', language) || "Region"}
              </label>
              <Select 
                value={selectedRegion}
                onValueChange={(value) => handleFilterChange('region', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getTranslation('common.logistics.selectRegion', language) || "Select Region"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{getTranslation('common.logistics.allRegions', language) || "All Regions"}</SelectItem>
                  <SelectItem value="central">{getTranslation('common.logistics.regions.central', language) || "Central Region"}</SelectItem>
                  <SelectItem value="eastern">{getTranslation('common.logistics.regions.eastern', language) || "Eastern Region"}</SelectItem>
                  <SelectItem value="western">{getTranslation('common.logistics.regions.western', language) || "Western Region"}</SelectItem>
                  <SelectItem value="northern">{getTranslation('common.logistics.regions.northern', language) || "Northern Region"}</SelectItem>
                  <SelectItem value="southern">{getTranslation('common.logistics.regions.southern', language) || "Southern Region"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {getTranslation('common.logistics.shippingMethod', language) || "Shipping Method"}
              </label>
              <Select 
                value={selectedShippingMethod}
                onValueChange={(value) => handleFilterChange('shipping_method', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getTranslation('common.logistics.selectShipping', language) || "Select Shipping Method"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{getTranslation('common.logistics.allMethods', language) || "All Methods"}</SelectItem>
                  <SelectItem value="express">{getTranslation('common.logistics.express', language) || "Express"}</SelectItem>
                  <SelectItem value="standard">{getTranslation('common.logistics.standard', language) || "Standard"}</SelectItem>
                  <SelectItem value="economy">{getTranslation('common.logistics.economy', language) || "Economy"}</SelectItem>
                  <SelectItem value="same-day">{getTranslation('common.logistics.sameDay', language) || "Same Day"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {getTranslation('common.logistics.deliveryTimeRange', language) || "Delivery Time Range (Days)"}
              </label>
              <div className="px-2">
                <Slider
                  value={deliveryTimeRange}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(value) => setDeliveryTimeRange(value as number[])}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs">{deliveryTimeRange[0]} {deliveryTimeRange[0] === 1 ? getTranslation('common.logistics.day', language) || "day" : getTranslation('common.logistics.days', language) || "days"}</span>
                  <span className="text-xs">{deliveryTimeRange[1]} {getTranslation('common.logistics.days', language) || "days"}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {getTranslation('common.logistics.costRange', language) || "Cost Range ($)"}
              </label>
              <div className="px-2">
                <Slider
                  value={costRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={(value) => setCostRange(value as number[])}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs">${costRange[0]}</span>
                  <span className="text-xs">${costRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="international" 
                checked={isInternational}
                onCheckedChange={(checked) => handleFilterChange('is_international', checked)}
              />
              <label htmlFor="international" className="text-sm font-medium">
                {getTranslation('common.logistics.international', language) || "International Shipments"}
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="customs-clearance" 
                checked={hasClearance}
                onCheckedChange={(checked) => handleFilterChange('has_clearance', checked)}
              />
              <label htmlFor="customs-clearance" className="text-sm font-medium">
                {getTranslation('common.logistics.customsClearance', language) || "Requires Customs Clearance"}
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="special-handling" 
                checked={hasSpecialHandling}
                onCheckedChange={(checked) => handleFilterChange('has_special_handling', checked)}
              />
              <label htmlFor="special-handling" className="text-sm font-medium">
                {getTranslation('common.logistics.specialHandling', language) || "Special Handling"}
              </label>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end space-x-2">
            <Button variant="outline" onClick={clearAllFilters}>
              {getTranslation('common.logistics.resetFilters', language) || "Reset Filters"}
            </Button>
            <Button onClick={() => setShowAdvancedFilters(false)}>
              {getTranslation('common.logistics.applyFilters', language) || "Apply Filters"}
            </Button>
          </div>
        </div>
      )}
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {activeFilters.map(filter => (
            <Badge 
              key={filter} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              <Tags className="h-3 w-3" />
              <span className="capitalize">
                {filter.replace('_', ' ')}
              </span>
              <button 
                className="ml-1 hover:bg-muted rounded-full" 
                onClick={() => handleFilterChange(filter, filter === 'is_international' || filter === 'has_clearance' || filter === 'has_special_handling' ? false : 'all')}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
