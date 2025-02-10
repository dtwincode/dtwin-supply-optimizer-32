
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ForecastFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedWarehouse: string;
  setSelectedWarehouse: (warehouse: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
  selectedSku: string;
  setSelectedSku: (sku: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
  channelTypes: string[];
  warehouses: string[];
  forecastData: any[];
}

export const ForecastFilters = ({
  searchQuery,
  setSearchQuery,
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
  selectedSku,
  setSelectedSku,
  regions,
  cities,
  channelTypes,
  warehouses,
  forecastData,
}: ForecastFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      <div className="flex gap-4">
        <Input
          placeholder="Search forecasts..."
          className="w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Region" />
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {selectedRegion !== "all" && cities[selectedRegion as keyof typeof cities].map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Channel Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {channelTypes.map(channel => (
              <SelectItem key={channel} value={channel}>{channel}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map(warehouse => (
              <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Array.from(new Set(forecastData.map(item => item.category))).map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={selectedSubcategory} 
          onValueChange={setSelectedSubcategory}
          disabled={selectedCategory === "all"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subcategories</SelectItem>
            {selectedCategory !== "all" && 
              Array.from(new Set(forecastData
                .filter(item => item.category === selectedCategory)
                .map(item => item.subcategory)))
                .map(subcategory => (
                  <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                ))
            }
          </SelectContent>
        </Select>
        <Select 
          value={selectedSku} 
          onValueChange={setSelectedSku}
          disabled={selectedSubcategory === "all"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="SKU" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SKUs</SelectItem>
            {selectedSubcategory !== "all" && 
              Array.from(new Set(forecastData
                .filter(item => 
                  item.category === selectedCategory && 
                  item.subcategory === selectedSubcategory)
                .map(item => item.sku)))
                .map(sku => (
                  <SelectItem key={sku} value={sku}>{sku}</SelectItem>
                ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
