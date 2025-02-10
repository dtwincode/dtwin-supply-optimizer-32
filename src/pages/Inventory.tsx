
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
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

// Mock data - replace with actual API data later
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
  },
];

const Inventory = () => {
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
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="components">Components</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buffer Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

        {/* Inventory Table */}
        <Card>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Buffer Zone</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Max Stock</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item) => (
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
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell>{item.maxStock}</TableCell>
                    <TableCell>{item.leadTime}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
