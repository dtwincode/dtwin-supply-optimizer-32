
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ForecastDataPoint } from "@/utils/forecasting/productFilters";

interface ProductFilterProps {
  selectedL1MainProd: string;
  setSelectedL1MainProd: (value: string) => void;
  selectedL2ProdLine: string;
  setSelectedL2ProdLine: (value: string) => void;
  selectedL3ProdCategory: string;
  setSelectedL3ProdCategory: (value: string) => void;
  selectedL4DeviceMake: string;
  setSelectedL4DeviceMake: (value: string) => void;
  selectedL5ProdSubCategory: string;
  setSelectedL5ProdSubCategory: (value: string) => void;
  selectedL6DeviceModel: string;
  setSelectedL6DeviceModel: (value: string) => void;
  selectedL7DeviceColor: string;
  setSelectedL7DeviceColor: (value: string) => void;
  selectedL8DeviceStorage: string;
  setSelectedL8DeviceStorage: (value: string) => void;
  forecastData: ForecastDataPoint[];
}

export const ProductFilter = ({
  selectedL1MainProd,
  setSelectedL1MainProd,
  selectedL2ProdLine,
  setSelectedL2ProdLine,
  selectedL3ProdCategory,
  setSelectedL3ProdCategory,
  selectedL4DeviceMake,
  setSelectedL4DeviceMake,
  selectedL5ProdSubCategory,
  setSelectedL5ProdSubCategory,
  selectedL6DeviceModel,
  setSelectedL6DeviceModel,
  selectedL7DeviceColor,
  setSelectedL7DeviceColor,
  selectedL8DeviceStorage,
  setSelectedL8DeviceStorage,
  forecastData,
}: ProductFilterProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select value={selectedL1MainProd} onValueChange={setSelectedL1MainProd}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Main Product" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Main Products</SelectItem>
          {Array.from(new Set(forecastData.map(item => item.l1_main_prod))).map(value => (
            <SelectItem key={value} value={value}>{value}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={selectedL2ProdLine} 
        onValueChange={setSelectedL2ProdLine}
        disabled={selectedL1MainProd === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Product Line" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Product Lines</SelectItem>
          {selectedL1MainProd !== "all" && 
            Array.from(new Set(forecastData
              .filter(item => item.l1_main_prod === selectedL1MainProd)
              .map(item => item.l2_prod_line)))
              .map(value => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))
          }
        </SelectContent>
      </Select>
      
      <Select 
        value={selectedL3ProdCategory} 
        onValueChange={setSelectedL3ProdCategory}
        disabled={selectedL2ProdLine === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Product Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Product Categories</SelectItem>
          {selectedL2ProdLine !== "all" && 
            Array.from(new Set(forecastData
              .filter(item => 
                item.l1_main_prod === selectedL1MainProd &&
                item.l2_prod_line === selectedL2ProdLine)
              .map(item => item.l3_prod_category)))
              .map(value => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))
          }
        </SelectContent>
      </Select>

      <Select 
        value={selectedL4DeviceMake} 
        onValueChange={setSelectedL4DeviceMake}
        disabled={selectedL3ProdCategory === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Device Make" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Device Makes</SelectItem>
          {selectedL3ProdCategory !== "all" && 
            Array.from(new Set(forecastData
              .filter(item => 
                item.l1_main_prod === selectedL1MainProd &&
                item.l2_prod_line === selectedL2ProdLine &&
                item.l3_prod_category === selectedL3ProdCategory)
              .map(item => item.l4_device_make)))
              .map(value => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))
          }
        </SelectContent>
      </Select>

      <Select 
        value={selectedL5ProdSubCategory} 
        onValueChange={setSelectedL5ProdSubCategory}
        disabled={selectedL4DeviceMake === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Product Sub Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sub Categories</SelectItem>
          {selectedL4DeviceMake !== "all" && 
            Array.from(new Set(forecastData
              .filter(item => 
                item.l1_main_prod === selectedL1MainProd &&
                item.l2_prod_line === selectedL2ProdLine &&
                item.l3_prod_category === selectedL3ProdCategory &&
                item.l4_device_make === selectedL4DeviceMake)
              .map(item => item.l5_prod_sub_category)))
              .map(value => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))
          }
        </SelectContent>
      </Select>

      <Select 
        value={selectedL6DeviceModel} 
        onValueChange={setSelectedL6DeviceModel}
        disabled={selectedL5ProdSubCategory === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Device Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Device Models</SelectItem>
          {selectedL5ProdSubCategory !== "all" && 
            Array.from(new Set(forecastData
              .filter(item => 
                item.l1_main_prod === selectedL1MainProd &&
                item.l2_prod_line === selectedL2ProdLine &&
                item.l3_prod_category === selectedL3ProdCategory &&
                item.l4_device_make === selectedL4DeviceMake &&
                item.l5_prod_sub_category === selectedL5ProdSubCategory)
              .map(item => item.l6_device_model)))
              .map(value => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))
          }
        </SelectContent>
      </Select>

      <Select 
        value={selectedL7DeviceColor} 
        onValueChange={setSelectedL7DeviceColor}
        disabled={selectedL6DeviceModel === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Device Color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Colors</SelectItem>
          {selectedL6DeviceModel !== "all" && 
            Array.from(new Set(forecastData
              .filter(item => 
                item.l1_main_prod === selectedL1MainProd &&
                item.l2_prod_line === selectedL2ProdLine &&
                item.l3_prod_category === selectedL3ProdCategory &&
                item.l4_device_make === selectedL4DeviceMake &&
                item.l5_prod_sub_category === selectedL5ProdSubCategory &&
                item.l6_device_model === selectedL6DeviceModel)
              .map(item => item.l7_device_color)))
              .map(value => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))
          }
        </SelectContent>
      </Select>

      <Select 
        value={selectedL8DeviceStorage} 
        onValueChange={setSelectedL8DeviceStorage}
        disabled={selectedL7DeviceColor === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Device Storage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Storage Options</SelectItem>
          {selectedL7DeviceColor !== "all" && 
            Array.from(new Set(forecastData
              .filter(item => 
                item.l1_main_prod === selectedL1MainProd &&
                item.l2_prod_line === selectedL2ProdLine &&
                item.l3_prod_category === selectedL3ProdCategory &&
                item.l4_device_make === selectedL4DeviceMake &&
                item.l5_prod_sub_category === selectedL5ProdSubCategory &&
                item.l6_device_model === selectedL6DeviceModel &&
                item.l7_device_color === selectedL7DeviceColor)
              .map(item => item.l8_device_storage)))
              .map(value => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))
          }
        </SelectContent>
      </Select>
    </div>
  );
};
