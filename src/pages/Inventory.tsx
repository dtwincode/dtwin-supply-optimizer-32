import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Waves, 
  Filter, 
  TreeDeciduous,
  Calendar,
  TrendingUp,
  Bell,
  Settings,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ITEMS_PER_PAGE = 10;

const inventoryData = [
  {
    id: 1,
    sku: "PRD-001",
    name: "Product A",
    currentStock: 65,
    bufferZone: "green",
    minStock: 50,
    maxStock: 100,
    leadTime: "5 days",
    category: "Electronics",
    subcategory: "Smartphones",
    lastUpdated: "2024-02-10",
    decouplingPoint: {
      type: "Strategic",
      location: "Distribution Center NA",
      reason: "High service level requirement",
      variabilityFactor: "High demand variability",
      bufferProfile: "M-H-H"
    },
    location: "North America",
    productFamily: "Consumer Electronics",
    netFlow: {
      onHand: 65,
      onOrder: 30,
      qualifiedDemand: 40,
      netFlowPosition: 55,
      avgDailyUsage: 8,
      orderCycle: 7,
      redZone: 35,
      yellowZone: 30,
      greenZone: 35
    },
    region: "Central Region",
    city: "Riyadh",
    channel: "B2B",
    warehouse: "Distribution Center NA"
  },
  {
    id: 2,
    sku: "PRD-002",
    name: "Product B",
    currentStock: 25,
    bufferZone: "red",
    minStock: 30,
    maxStock: 80,
    leadTime: "7 days",
    category: "Electronics",
    subcategory: "Laptops",
    lastUpdated: "2024-02-10",
    decouplingPoint: {
      type: "Lead time",
      location: "Distribution Center EU",
      reason: "Long supplier lead time",
      variabilityFactor: "Long lead time variability",
      bufferProfile: "H-L-M"
    },
    location: "Europe",
    productFamily: "Industrial Components",
    netFlow: {
      onHand: 25,
      onOrder: 40,
      qualifiedDemand: 50,
      netFlowPosition: 15,
      avgDailyUsage: 5,
      orderCycle: 10,
      redZone: 20,
      yellowZone: 15,
      greenZone: 25
    },
    region: "Eastern Region",
    city: "Dammam",
    channel: "B2C",
    warehouse: "Distribution Center EU"
  },
  {
    id: 3,
    sku: "PRD-003",
    name: "Product C",
    currentStock: 45,
    bufferZone: "yellow",
    minStock: 40,
    maxStock: 90,
    leadTime: "3 days",
    category: "Electronics",
    subcategory: "Tablets",
    lastUpdated: "2024-02-10",
    decouplingPoint: {
      type: "Capacity",
      location: "Manufacturing Plant Asia",
      reason: "High demand variability",
      variabilityFactor: "Supply variability",
      bufferProfile: "M-M-M"
    },
    location: "Asia",
    productFamily: "Accessories",
    netFlow: {
      onHand: 45,
      onOrder: 20,
      qualifiedDemand: 30,
      netFlowPosition: 35,
      avgDailyUsage: 6,
      orderCycle: 5,
      redZone: 25,
      yellowZone: 20,
      greenZone: 30
    },
    region: "Western Region",
    city: "Jeddah",
    channel: "Wholesale",
    warehouse: "Manufacturing Plant Asia"
  },
];

const locations = [
  "Distribution Center NA",
  "Distribution Center EU",
  "Manufacturing Plant Asia",
  "Regional Warehouse SA"
];

const decouplingReasons = [
  "High service level requirement",
  "Long supplier lead time",
  "High demand variability",
  "Strategic stock positioning",
  "Supply reliability issues"
];

const variabilityFactors = [
  "High demand variability",
  "Long lead time variability",
  "Supply variability",
  "Capacity constraints",
  "Market dynamics"
];

const bufferProfiles = [
  "L-L-L", // Low LT, Low Variability, Low MOQ
  "M-M-M", // Medium across all factors
  "H-H-H", // High across all factors
  "M-H-H", // Medium LT, High Variability, High MOQ
  "H-L-M"  // High LT, Low Variability, Medium MOQ
];

const productFamilies = [
  "Consumer Electronics",
  "Industrial Components",
  "Accessories",
];

const regions = [
  "Central Region",
  "Eastern Region",
  "Western Region",
  "Northern Region",
  "Southern Region"
];

const cities = {
  "Central Region": ["Riyadh", "Al-Kharj", "Al-Qassim"],
  "Eastern Region": ["Dammam", "Al-Khobar", "Dhahran"],
  "Western Region": ["Jeddah", "Mecca", "Medina"],
  "Northern Region": ["Tabuk", "Hail", "Al-Jawf"],
  "Southern Region": ["Abha", "Jizan", "Najran"]
};

const channelTypes = [
  "B2B",
  "B2C",
  "Wholesale",
  "Online Marketplace",
  "Direct Store",
  "Distribution Center"
];

const Inventory = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPurchaseOrderDialog, setShowPurchaseOrderDialog] = useState(false);
  const [showDecouplingDialog, setShowDecouplingDialog] = useState(false);
  const [showBufferAdjustmentDialog, setShowBufferAdjustmentDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [bufferFormState, setBufferFormState] = useState({
    redZone: "",
    yellowZone: "",
    greenZone: "",
    leadTimeFactor: "",
    variabilityFactor: ""
  });

  // Add new state for product hierarchy
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedSKU, setSelectedSKU] = useState<string>("all");

  const { toast } = useToast();

  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");

  // Get unique categories, subcategories, and SKUs
  const categories = [...new Set(inventoryData.map(item => item.category))];
  const subcategories = [...new Set(inventoryData
    .filter(item => selectedCategory === "all" || item.category === selectedCategory)
    .map(item => item.subcategory))];
  const skus = [...new Set(inventoryData
    .filter(item => 
      (selectedCategory === "all" || item.category === selectedCategory) &&
      (selectedSubcategory === "all" || item.subcategory === selectedSubcategory)
    )
    .map(item => item.sku))];

  const filteredData = useMemo(() => {
    return inventoryData.filter(item => {
      if (selectedLocation !== "all" && item.location !== selectedLocation) return false;
      if (selectedFamily !== "all" && item.productFamily !== selectedFamily) return false;
      if (selectedRegion !== "all" && item.region !== selectedRegion) return false;
      if (selectedCity !== "all" && item.city !== selectedCity) return false;
      if (selectedChannel !== "all" && item.channel !== selectedChannel) return false;
      if (selectedWarehouse !== "all" && item.warehouse !== selectedWarehouse) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (selectedSubcategory !== "all" && item.subcategory !== selectedSubcategory) return false;
      if (selectedSKU !== "all" && item.sku !== selectedSKU) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.sku.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.productFamily.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [
    selectedLocation,
    selectedFamily,
    selectedRegion,
    selectedCity,
    selectedChannel,
    selectedWarehouse,
    selectedCategory,
    selectedSubcategory,
    selectedSKU,
    searchQuery,
    inventoryData
  ]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const calculateBufferSize = (item: any) => {
    const leadTimeFactor = item.leadTime === "5 days" ? 1 : item.leadTime === "7 days" ? 1.4 : 0.8;
    const variabilityFactor = item.decouplingPoint.variabilityFactor === "High demand variability" ? 1.5 : 1;
    const baseBuffer = item.netFlow.avgDailyUsage * leadTimeFactor * variabilityFactor;
    return {
      red: Math.round(baseBuffer * 0.33),
      yellow: Math.round(baseBuffer * 0.33),
      green: Math.round(baseBuffer * 0.34)
    };
  };

  const handleBufferFormChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBufferFormState(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleBufferAdjustment = (sku: string, adjustmentType: string, value: string) => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid number for buffer adjustment",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Buffer Adjusted",
      description: `${adjustmentType} adjustment applied to ${sku}`,
    });
    setShowBufferAdjustmentDialog(false);
  };

  const handleSaveBufferAdjustments = () => {
    if (selectedProduct) {
      // Now passing string values directly from the form state
      const { redZone, yellowZone, greenZone, leadTimeFactor, variabilityFactor } = bufferFormState;
      if (redZone) handleBufferAdjustment(selectedProduct.sku, "red", redZone);
      if (yellowZone) handleBufferAdjustment(selectedProduct.sku, "yellow", yellowZone);
      if (greenZone) handleBufferAdjustment(selectedProduct.sku, "green", greenZone);
    }
    setShowBufferAdjustmentDialog(false);
  };

  const handleCreatePurchaseOrder = () => {
    toast({
      title: "Purchase Order Created",
      description: `Created PO for ${selectedProduct?.name}`,
    });
    setShowPurchaseOrderDialog(false);
  };

  const handleDecouplingPointChange = (
    sku: string,
    newPoint: {
      type: string;
      location: string;
      reason: string;
      variabilityFactor: string;
      bufferProfile: string;
    }
  ) => {
    toast({
      title: "Decoupling Point Updated",
      description: `Updated decoupling configuration for ${sku}`,
    });
    setShowDecouplingDialog(false);
  };

  const calculateBufferStatus = (netFlow: any) => {
    const totalBuffer = netFlow.redZone + netFlow.yellowZone + netFlow.greenZone;
    const currentPosition = netFlow.netFlowPosition;
    
    if (currentPosition >= netFlow.greenZone) return "green";
    if (currentPosition >= netFlow.yellowZone) return "yellow";
    return "red";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">DDMRP Inventory Management</h1>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success-50 rounded-full">
                <CheckCircle className="h-6 w-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Green Zone</p>
                <p className="text-2xl font-semibold">45 SKUs</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-warning-50 rounded-full">
                <AlertTriangle className="h-6 w-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Yellow Zone</p>
                <p className="text-2xl font-semibold">28 SKUs</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-danger-50 rounded-full">
                <Package className="h-6 w-6 text-danger-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Red Zone</p>
                <p className="text-2xl font-semibold">12 SKUs</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-full">
                <Waves className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Flow Position</p>
                <p className="text-2xl font-semibold">105 units</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-[800px] p-4">
              <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
              <TabsTrigger value="netflow">Net Flow Analysis</TabsTrigger>
              <TabsTrigger value="decoupling">Decoupling Points</TabsTrigger>
              <TabsTrigger value="buffers">Buffer Management</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Buffer Zone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Product Family</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.currentStock}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.bufferZone === "green"
                                ? "bg-success-50 text-success-700"
                                : item.bufferZone === "yellow"
                                ? "bg-warning-50 text-warning-700"
                                : "bg-danger-50 text-danger-700"
                            }`}
                          >
                            {item.bufferZone.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.productFamily}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowPurchaseOrderDialog(true);
                            }}
                          >
                            Create PO
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} items
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="netflow">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>On Hand</TableHead>
                      <TableHead>On Order</TableHead>
                      <TableHead>Qualified Demand</TableHead>
                      <TableHead>Net Flow Position</TableHead>
                      <TableHead>ADU</TableHead>
                      <TableHead>Buffer Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.netFlow.onHand}</TableCell>
                        <TableCell>{item.netFlow.onOrder}</TableCell>
                        <TableCell>{item.netFlow.qualifiedDemand}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            calculateBufferStatus(item.netFlow) === "green"
                              ? "text-success-600"
                              : calculateBufferStatus(item.netFlow) === "yellow"
                              ? "text-warning-600"
                              : "text-danger-600"
                          }`}>
                            {item.netFlow.netFlowPosition}
                          </span>
                        </TableCell>
                        <TableCell>{item.netFlow.avgDailyUsage}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            calculateBufferStatus(item.netFlow) === "green"
                              ? "bg-success-50 text-success-700"
                              : calculateBufferStatus(item.netFlow) === "yellow"
                              ? "bg-warning-50 text-warning-700"
                              : "bg-danger-50 text-danger-700"
                          }`}>
                            {calculateBufferStatus(item.netFlow).toUpperCase()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="decoupling">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Buffer Profile</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.decouplingPoint.type}</TableCell>
                        <TableCell>{item.decouplingPoint.location}</TableCell>
                        <TableCell>{item.decouplingPoint.bufferProfile}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowDecouplingDialog(true);
                            }}
                          >
                            Configure
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="buffers">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Red Zone</TableHead>
                      <TableHead>Yellow Zone</TableHead>
                      <TableHead>Green Zone</TableHead>
                      <TableHead>Lead Time Factor</TableHead>
                      <TableHead>Variability Factor</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => {
                      const bufferSizes = calculateBufferSize(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{bufferSizes.red}</TableCell>
                          <TableCell>{bufferSizes.yellow}</TableCell>
                          <TableCell>{bufferSizes.green}</TableCell>
                          <TableCell>{item.leadTime}</TableCell>
                          <TableCell>{item.decouplingPoint.variabilityFactor}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(item);
                                setShowBufferAdjustmentDialog(true);
                              }}
                            >
                              Adjust
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} items
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="adjustments">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Seasonal Pattern</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Last Adjustment</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>Normal</TableCell>
                        <TableCell>Stable</TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                        <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(item);
                              // Add adjustment dialog logic here
                            }}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Dialog open={showDecouplingDialog} onOpenChange={setShowDecouplingDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configure Decoupling Point</DialogTitle>
              <DialogDescription>
                Update decoupling point configuration for {selectedProduct?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Decoupling Point Type</Label>
                  <Select
                    defaultValue={selectedProduct?.decouplingPoint?.type}
                    onValueChange={(value) => {
                      if (selectedProduct) {
                        selectedProduct.decouplingPoint.type = value;
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strategic">Strategic</SelectItem>
                      <SelectItem value="Lead time">Lead time</SelectItem>
                      <SelectItem value="Capacity">Capacity</SelectItem>
                      <SelectItem value="MTO">Make to Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    defaultValue={selectedProduct?.decouplingPoint?.location}
                    onValueChange={(value) => {
                      if (selectedProduct) {
                        selectedProduct.decouplingPoint.location = value;
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select
                    defaultValue={selectedProduct?.decouplingPoint?.reason}
                    onValueChange={(value) => {
                      if (selectedProduct) {
                        selectedProduct.decouplingPoint.reason = value;
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {decouplingReasons.map(reason => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space
