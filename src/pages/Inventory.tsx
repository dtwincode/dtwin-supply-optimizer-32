
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
import { Package, AlertTriangle, CheckCircle, Waves, Filter, TreeDeciduous } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Enhanced mock data with location and hierarchy
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
    lastUpdated: "2024-02-10",
    decouplingPoint: "Strategic",
    location: "North America",
    productFamily: "Consumer Electronics",
    netFlow: {
      onHand: 65,
      onOrder: 30,
      qualifiedDemand: 40,
      netFlowPosition: 55
    }
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
    category: "Components",
    lastUpdated: "2024-02-10",
    decouplingPoint: "Lead time",
    netFlow: {
      onHand: 25,
      onOrder: 40,
      qualifiedDemand: 50,
      netFlowPosition: 15
    }
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
    category: "Accessories",
    lastUpdated: "2024-02-10",
    decouplingPoint: "Capacity",
    netFlow: {
      onHand: 45,
      onOrder: 20,
      qualifiedDemand: 30,
      netFlowPosition: 35
    }
  },
];

const locations = ["North America", "Europe", "Asia", "South America"];
const productFamilies = ["Consumer Electronics", "Industrial Components", "Accessories"];

const Inventory = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [showPurchaseOrderDialog, setShowPurchaseOrderDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();

  const handleCreatePurchaseOrder = () => {
    toast({
      title: "Purchase Order Created",
      description: `Created PO for ${selectedProduct?.name}`,
    });
    setShowPurchaseOrderDialog(false);
  };

  const handleDecouplingPointChange = (sku: string, newPoint: string) => {
    toast({
      title: "Decoupling Point Updated",
      description: `Updated decoupling point for ${sku} to ${newPoint}`,
    });
  };

  const filteredData = inventoryData.filter(item => {
    if (selectedLocation !== "all" && item.location !== selectedLocation) return false;
    if (selectedFamily !== "all" && item.productFamily !== selectedFamily) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">DDMRP Inventory Management</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              className="w-[250px]"
            />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFamily} onValueChange={setSelectedFamily}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                {productFamilies.map(family => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buffer Status Cards */}
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

        {/* Inventory Tabs and Table */}
        <Card>
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px] p-4">
              <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
              <TabsTrigger value="netflow">Net Flow Analysis</TabsTrigger>
              <TabsTrigger value="decoupling">Decoupling Points</TabsTrigger>
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
                    {filteredData.map((item) => (
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
                      <TableHead>Location</TableHead>
                      <TableHead>Product Family</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.netFlow.onHand}</TableCell>
                        <TableCell>{item.netFlow.onOrder}</TableCell>
                        <TableCell>{item.netFlow.qualifiedDemand}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            item.netFlow.netFlowPosition > item.minStock
                              ? "text-success-600"
                              : "text-danger-600"
                          }`}>
                            {item.netFlow.netFlowPosition}
                          </span>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.productFamily}</TableCell>
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
                      <TableHead>Current Decoupling Point</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Product Family</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={item.decouplingPoint}
                            onValueChange={(value) => handleDecouplingPointChange(item.sku, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select point" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Strategic">Strategic</SelectItem>
                              <SelectItem value="Lead time">Lead time</SelectItem>
                              <SelectItem value="Capacity">Capacity</SelectItem>
                              <SelectItem value="MTO">Make to Order</SelectItem>
                            </SelectContent>
                          </Select>
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
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Purchase Order Dialog */}
        <Dialog open={showPurchaseOrderDialog} onOpenChange={setShowPurchaseOrderDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Create a new purchase order for {selectedProduct?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input type="number" placeholder="Enter quantity" />
              </div>
              <div>
                <label className="text-sm font-medium">Expected Delivery Date</label>
                <Input type="date" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowPurchaseOrderDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePurchaseOrder}>
                  Create Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
