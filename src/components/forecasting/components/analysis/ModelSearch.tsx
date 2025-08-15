
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelSearchProps {
  searchTerm: string;
  selectedSku: string;
  selectedLocation: string;
  onSearchChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  skus: string[];
  locations: string[];
}

export const ModelSearch = ({
  searchTerm,
  selectedSku,
  selectedLocation,
  onSearchChange,
  onSkuChange,
  onLocationChange,
  skus,
  locations
}: ModelSearchProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search models..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-[200px]"
      />
      <Select value={selectedSku} onValueChange={onSkuChange}>
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
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map(loc => (
            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
