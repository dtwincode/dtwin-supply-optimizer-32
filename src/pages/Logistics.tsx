
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
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

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
  const { language } = useLanguage();
  
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
            {getTranslation("logistics.optimizeSupplyChain", language)}
          </p>
        </div>

        <ErrorBoundary
          fallback={
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {language === 'en' ? 'Error Loading Metrics' : 'خطأ في تحميل المقاييس'}
              </AlertTitle>
              <AlertDescription>
                {language === 'en' 
                  ? 'There was a problem loading the logistics metrics. Please try refreshing the page.'
                  : 'حدثت مشكلة في تحميل مقاييس الخدمات اللوجستية. يرجى تحديث الصفحة.'}
              </AlertDescription>
            </Alert>
          }
        >
          <LogisticsMetricsGrid />
        </ErrorBoundary>
        
        <ErrorBoundary
          fallback={
            <Card className="col-span-2 p-6">
              <AlertTitle className="text-lg font-semibold">
                {getTranslation("logistics.logisticsTrackingMap", language)}
              </AlertTitle>
              <AlertDescription className="mt-4">
                {getTranslation("logistics.mapUnavailable", language)}
              </AlertDescription>
            </Card>
          }
        >
          <LogisticsMap />
        </ErrorBoundary>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">
              {getTranslation("logistics.orders", language)}
            </TabsTrigger>
            <TabsTrigger value="po-pipeline">
              {getTranslation("logistics.poPipeline", language)}
            </TabsTrigger>
            <TabsTrigger value="route-optimization">
              {getTranslation("logistics.routeOptimization", language)}
            </TabsTrigger>
            <TabsTrigger value="transport-modes">
              {getTranslation("logistics.transportModes", language)}
            </TabsTrigger>
            <TabsTrigger value="documents">
              {getTranslation("logistics.documents", language)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <div className="p-6">
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {language === 'en' ? 'Error Loading Orders' : 'خطأ في تحميل الطلبات'}
                      </AlertTitle>
                      <AlertDescription>
                        {language === 'en'
                          ? 'There was a problem loading the logistics orders data.'
                          : 'حدثت مشكلة في تحميل بيانات طلبات الخدمات اللوجستية.'}
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
                    <h3 className="text-lg font-medium">
                      {getTranslation("logistics.purchaseOrderPipeline", language)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getTranslation("logistics.monitorAndTrack", language)}
                    </p>
                  </div>
                  <LogisticsFilters />
                </div>
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {language === 'en' ? 'Error Loading PO Pipeline' : 'خطأ في تحميل مسار أوامر الشراء'}
                      </AlertTitle>
                      <AlertDescription>
                        {language === 'en'
                          ? 'There was a problem loading the purchase order pipeline data.'
                          : 'حدثت مشكلة في تحميل بيانات مسار أوامر الشراء.'}
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
                  <h3 className="text-lg font-medium">
                    {getTranslation("logistics.routeOptimization", language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getTranslation("logistics.routeOptimizationDesc", language)}
                  </p>
                </div>
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {language === 'en' ? 'Error Loading Route Optimization' : 'خطأ في تحميل تحسين المسار'}
                      </AlertTitle>
                      <AlertDescription>
                        {language === 'en'
                          ? 'There was a problem loading the route optimization tools.'
                          : 'حدثت مشكلة في تحميل أدوات تحسين المسار.'}
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
                  <h3 className="text-lg font-medium">
                    {getTranslation("logistics.transportModes", language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getTranslation("logistics.transportModesDesc", language)}
                  </p>
                </div>
                <ErrorBoundary
                  fallback={
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {language === 'en' ? 'Error Loading Transport Modes' : 'خطأ في تحميل وسائل النقل'}
                      </AlertTitle>
                      <AlertDescription>
                        {language === 'en'
                          ? 'There was a problem loading the transport modes data.'
                          : 'حدثت مشكلة في تحميل بيانات وسائل النقل.'}
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
                  <h3 className="text-lg font-medium">
                    {getTranslation("logistics.documentManagement", language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getTranslation("logistics.uploadAndManage", language)}
                  </p>
                </div>
                <div className="space-y-8">
                  <ErrorBoundary>
                    <DocumentUpload 
                      orderId="ORD-20240315-001" 
                      onUploadComplete={() => window.location.reload()}
                    />
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-4">
                        {getTranslation("logistics.uploadedDocuments", language)}
                      </h4>
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
