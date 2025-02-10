
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
  selectedSku: string;
  setSelectedSku: (sku: string) => void;
  forecastData: any[];
}

export const ProductFilter = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSku,
  setSelectedSku,
  forecastData,
}: ProductFilterProps) => {
  return (
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
  );
};
