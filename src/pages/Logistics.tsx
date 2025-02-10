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
import { Truck, Clock, PackageCheck, AlertOctagon, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// New mock data for PO pipeline monitoring
const poPipelineData = [
  {
    id: "PO-2024-001",
    supplier: "Supplier A",
    stage: "documentation",
    status: "pending",
    startDate: "2024-02-15",
    eta: "2024-02-20",
    completionRate: 25,
    blockers: "Awaiting customs clearance",
    lastUpdated: "2024-02-16 09:30",
    priority: "high"
  },
  {
    id: "PO-2024-002",
    supplier: "Supplier B",
    stage: "shipping",
    status: "in-progress",
    startDate: "2024-02-14",
    eta: "2024-02-19",
    completionRate: 60,
    blockers: null,
    lastUpdated: "2024-02-16 10:15",
    priority: "medium"
  },
  {
    id: "PO-2024-003",
    supplier: "Supplier C",
    stage: "quality-check",
    status: "delayed",
    startDate: "2024-02-13",
    eta: "2024-02-18",
    completionRate: 80,
    blockers: "Failed quality inspection",
    lastUpdated: "2024-02-16 11:00",
    priority: "high"
  }
];

const Logistics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Optimize and track supply chain operations
          </p>
        </div>

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

        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="po-pipeline">PO Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
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
          </TabsContent>

          <TabsContent value="po-pipeline">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Purchase Order Pipeline</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor and track purchase orders through different stages
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="shipping">Shipping</SelectItem>
                        <SelectItem value="quality-check">Quality Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Blockers</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poPipelineData.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.supplier}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {po.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              po.status === "in-progress"
                                ? "default"
                                : po.status === "delayed"
                                ? "destructive"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{po.startDate}</TableCell>
                        <TableCell>{po.eta}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  po.completionRate >= 80
                                    ? "bg-success"
                                    : po.completionRate >= 40
                                    ? "bg-warning"
                                    : "bg-primary"
                                }`}
                                style={{ width: `${po.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {po.completionRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {po.blockers ? (
                            <span className="text-destructive">{po.blockers}</span>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>{po.lastUpdated}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              po.priority === "high"
                                ? "destructive"
                                : po.priority === "medium"
                                ? "secondary"
                                : "default"
                            }
                            className="capitalize"
                          >
                            {po.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Logistics;
