
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
import { Truck, Clock, PackageCheck, AlertOctagon } from "lucide-react";

// Mock data - replace with actual API data
const logisticsData = [
  {
    id: 1,
    orderRef: "PO-001",
    supplier: "Supplier A",
    items: 25,
    status: "in-transit",
    etd: "2024-02-15",
    eta: "2024-02-20",
    leadTime: "5 days",
    priority: "high",
  },
  {
    id: 2,
    orderRef: "PO-002",
    supplier: "Supplier B",
    items: 15,
    status: "delayed",
    etd: "2024-02-12",
    eta: "2024-02-18",
    leadTime: "6 days",
    priority: "medium",
  },
  {
    id: 3,
    orderRef: "PO-003",
    supplier: "Supplier C",
    items: 30,
    status: "processing",
    etd: "2024-02-18",
    eta: "2024-02-22",
    leadTime: "4 days",
    priority: "low",
  },
];

const Logistics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Supply Chain Execution</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search orders..."
              className="w-[250px]"
            />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-full">
                <Truck className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Transit</p>
                <p className="text-2xl font-semibold">25</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-warning-50 rounded-full">
                <Clock className="h-6 w-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-semibold">18</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success-50 rounded-full">
                <PackageCheck className="h-6 w-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-semibold">42</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-danger-50 rounded-full">
                <AlertOctagon className="h-6 w-6 text-danger-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delayed</p>
                <p className="text-2xl font-semibold">7</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Ref</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETD</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logisticsData.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderRef}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "in-transit"
                            ? "bg-primary-50 text-primary-700"
                            : order.status === "delayed"
                            ? "bg-danger-50 text-danger-700"
                            : "bg-warning-50 text-warning-700"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{order.etd}</TableCell>
                    <TableCell>{order.eta}</TableCell>
                    <TableCell>{order.leadTime}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.priority === "high"
                            ? "bg-danger-50 text-danger-700"
                            : order.priority === "medium"
                            ? "bg-warning-50 text-warning-700"
                            : "bg-success-50 text-success-700"
                        }`}
                      >
                        {order.priority.toUpperCase()}
                      </span>
                    </TableCell>
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

export default Logistics;
