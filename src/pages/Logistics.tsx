import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogisticsMap } from "@/components/logistics/LogisticsMap";
import { LogisticsMetricsGrid } from "@/components/logistics/metrics/LogisticsMetricsGrid";
import { LogisticsOrdersTable } from "@/components/logistics/orders/LogisticsOrdersTable";
import { POPipelineTable } from "@/components/logistics/pipeline/POPipelineTable";
import { LogisticsFilters } from "@/components/logistics/filters/LogisticsFilters";

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

        <LogisticsMetricsGrid />
        <LogisticsMap />

        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="po-pipeline">PO Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <div className="p-6">
                <LogisticsOrdersTable orders={logisticsData} />
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
                  <LogisticsFilters />
                </div>
                <POPipelineTable data={poPipelineData} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Logistics;
