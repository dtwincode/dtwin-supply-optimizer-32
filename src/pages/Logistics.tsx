
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
import { RouteOptimizationContainer } from "@/components/logistics/route-optimization/RouteOptimizationContainer";
import { TransportModeList } from "@/components/logistics/route-optimization/TransportModeList";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading to ensure all components have time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-32 w-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Optimize and track supply chain operations
          </p>
        </div>

        <ErrorBoundary
          fallback={
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Metrics</AlertTitle>
              <AlertDescription>
                There was a problem loading the logistics metrics. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          }
        >
          <LogisticsMetricsGrid />
        </ErrorBoundary>
        
        <ErrorBoundary
          fallback={
            <Card className="col-span-2 p-6">
              <AlertTitle className="text-lg font-semibold">Logistics Tracking Map</AlertTitle>
              <AlertDescription className="mt-4">
                Unable to load the logistics map. Please check your configuration.
              </AlertDescription>
            </Card>
          }
        >
          <LogisticsMap />
        </ErrorBoundary>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="po-pipeline">PO Pipeline</TabsTrigger>
            <TabsTrigger value="route-optimization">Route Optimization</TabsTrigger>
            <TabsTrigger value="transport-modes">Transport Modes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <div className="p-6">
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error Loading Orders</AlertTitle>
                      <AlertDescription>
                        There was a problem loading the logistics orders data.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <LogisticsOrdersTable />
                </ErrorBoundary>
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
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error Loading PO Pipeline</AlertTitle>
                      <AlertDescription>
                        There was a problem loading the purchase order pipeline data.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <POPipelineTable data={poPipelineData} />
                </ErrorBoundary>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="route-optimization">
            <Card>
              <div className="p-6">
                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-medium">Route Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculate optimal routes based on time, cost, or emissions
                  </p>
                </div>
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error Loading Route Optimization</AlertTitle>
                      <AlertDescription>
                        There was a problem loading the route optimization tools.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <RouteOptimizationContainer />
                </ErrorBoundary>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transport-modes">
            <Card>
              <div className="p-6">
                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-medium">Transport Modes</h3>
                  <p className="text-sm text-muted-foreground">
                    View and compare different transportation options
                  </p>
                </div>
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error Loading Transport Modes</AlertTitle>
                      <AlertDescription>
                        There was a problem loading the transport modes data.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <TransportModeList />
                </ErrorBoundary>
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
                  <ErrorBoundary>
                    <DocumentUpload 
                      orderId="ORD-20240315-001" 
                      onUploadComplete={() => window.location.reload()}
                    />
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-4">Uploaded Documents</h4>
                      <DocumentList orderId="ORD-20240315-001" />
                    </div>
                  </ErrorBoundary>
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
