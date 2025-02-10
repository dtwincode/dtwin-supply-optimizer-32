
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      <div className="flex gap-4">
        <Input
          placeholder="Search products, SKUs, locations..."
          className="w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={(value) => {
          setSelectedCategory(value);
          setSelectedSubcategory("all");
          setSelectedSKU("all");
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
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
          onValueChange={(value) => {
            setSelectedSubcategory(value);
            setSelectedSKU("all");
          }}
          disabled={selectedCategory === "all"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Subcategory" />
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select SKU" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SKUs</SelectItem>
            {skus.map(sku => (
              <SelectItem key={sku} value={sku}>{sku}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
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
        <Select value={selectedFamily} onValueChange={setSelectedFamily}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Product Family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Families</SelectItem>
            {productFamilies.map(family => (
              <SelectItem key={family} value={family}>{family}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InventoryFilters;
