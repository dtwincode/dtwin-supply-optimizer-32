
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogisticsMap } from "@/components/logistics/LogisticsMap";
import { LogisticsMetricsGrid } from "@/components/logistics/metrics/LogisticsMetricsGrid";
import { LogisticsOrdersTable } from "@/components/logistics/orders/LogisticsOrdersTable";
import { POPipelineTable } from "@/components/logistics/pipeline/POPipelineTable";
import { LogisticsFilters } from "@/components/logistics/filters/LogisticsFilters";
import { DocumentUpload } from "@/components/logistics/documents/DocumentUpload";
import { DocumentList } from "@/components/logistics/documents/DocumentList";

const poPipelineData = [
  {
    id: "PO-2024-001",
    supplier: "Supplier A Plastics",
    stage: "documentation",
    status: "pending",
    startDate: "2024-03-15",
    eta: "2024-03-21",
    completionRate: 25,
    blockers: "Awaiting customs clearance",
    lastUpdated: "2024-03-17 09:30",
    priority: "high"
  },
  {
    id: "PO-2024-002",
    supplier: "Supplier B Electronics",
    stage: "shipping",
    status: "in-progress",
    startDate: "2024-03-14",
    eta: "2024-03-20",
    completionRate: 60,
    blockers: null,
    lastUpdated: "2024-03-17 10:15",
    priority: "medium"
  },
  {
    id: "PO-2024-003",
    supplier: "Supplier C Manufacturing",
    stage: "quality-check",
    status: "delayed",
    startDate: "2024-03-10",
    eta: "2024-03-16",
    completionRate: 80,
    blockers: "Failed quality inspection",
    lastUpdated: "2024-03-17 11:00",
    priority: "high"
  },
  {
    id: "PO-2024-004",
    supplier: "Supplier D Components",
    stage: "customs-clearance",
    status: "pending",
    startDate: "2024-03-12",
    eta: "2024-03-19",
    completionRate: 45,
    blockers: "Missing documentation",
    lastUpdated: "2024-03-17 12:30",
    priority: "medium"
  },
  {
    id: "PO-2024-005",
    supplier: "Supplier E Materials",
    stage: "receiving",
    status: "in-progress",
    startDate: "2024-03-08",
    eta: "2024-03-18",
    completionRate: 90,
    blockers: null,
    lastUpdated: "2024-03-17 14:45",
    priority: "low"
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
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <div className="p-6">
                <LogisticsOrdersTable />
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

          <TabsContent value="documents">
            <Card>
              <div className="p-6">
                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-medium">Document Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and manage logistics documents
                  </p>
                </div>
                <div className="space-y-8">
                  <DocumentUpload 
                    orderId="ORD-20240315-001" 
                    onUploadComplete={() => window.location.reload()}
                  />
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-4">Uploaded Documents</h4>
                    <DocumentList orderId="ORD-20240315-001" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Logistics;
