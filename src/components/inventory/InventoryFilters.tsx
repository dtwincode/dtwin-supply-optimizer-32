
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InventoryFiltersProps {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  selectedFamily: string;
  setSelectedFamily: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedChannel: string;
  setSelectedChannel: (value: string) => void;
  selectedWarehouse: string;
  setSelectedWarehouse: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (value: string) => void;
  selectedSKU: string;
  setSelectedSKU: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categories: string[];
  subcategories: string[];
  skus: string[];
  productFamilies: string[];
  regions: string[];
  cities: { [key: string]: string[] };
  channelTypes: string[];
  locations: string[];
}

const CollapsibleSection = ({ 
  title, 
  isExpanded, 
  onToggle, 
  children 
}: { 
  title: string; 
  isExpanded: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) => (
  <Card className="w-full p-4 mb-4">
    <Button
      variant="ghost"
      className="w-full flex items-center justify-between p-2 hover:bg-transparent"
      onClick={onToggle}
    >
      <span className="text-lg font-semibold text-blue-600">{title}</span>
      <span className="text-gray-500 flex items-center gap-2">
        Click to {isExpanded ? 'collapse' : 'expand'}
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </span>
    </Button>
    {isExpanded && <div className="mt-4">{children}</div>}
  </Card>
);

const InventoryFilters = ({
  selectedLocation,
  setSelectedLocation,
  selectedFamily,
  setSelectedFamily,
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
  selectedChannel,
  setSelectedChannel,
  selectedWarehouse,
  setSelectedWarehouse,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSKU,
  setSelectedSKU,
  searchQuery,
  setSearchQuery,
  categories,
  subcategories,
  skus,
  productFamilies,
  regions,
  cities,
  channelTypes,
  locations,
}: InventoryFiltersProps) => {
  const [timePeriodExpanded, setTimePeriodExpanded] = useState(false);
  const [productHierarchyExpanded, setProductHierarchyExpanded] = useState(false);
  const [locationHierarchyExpanded, setLocationHierarchyExpanded] = useState(false);

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products, SKUs, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={selectedSubcategory} 
          onValueChange={setSelectedSubcategory}
          disabled={selectedCategory === "all"}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Subcategories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subcategories</SelectItem>
            {subcategories.map(subcategory => (
              <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={selectedSKU} 
          onValueChange={setSelectedSKU}
          disabled={selectedSubcategory === "all"}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All SKUs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SKUs</SelectItem>
            {skus.map(sku => (
              <SelectItem key={sku} value={sku}>{sku}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <CollapsibleSection
          title="Time Period Selection"
          isExpanded={timePeriodExpanded}
          onToggle={() => setTimePeriodExpanded(!timePeriodExpanded)}
        >
          {/* Time period selection content will go here */}
          <div className="text-gray-500">Time period selection options will be implemented here</div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Product Hierarchy"
          isExpanded={productHierarchyExpanded}
          onToggle={() => setProductHierarchyExpanded(!productHierarchyExpanded)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedFamily} onValueChange={setSelectedFamily}>
              <SelectTrigger>
                <SelectValue placeholder="All Families" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                {productFamilies.map(family => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Location Hierarchy"
          isExpanded={locationHierarchyExpanded}
          onToggle={() => setLocationHierarchyExpanded(!locationHierarchyExpanded)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedCity} 
              onValueChange={setSelectedCity}
              disabled={selectedRegion === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {selectedRegion !== "all" && cities[selectedRegion]?.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channelTypes.map(channel => (
                  <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default InventoryFilters;
