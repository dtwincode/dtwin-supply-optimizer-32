
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RouteOptimizationContainer } from '@/components/logistics/route-optimization/RouteOptimizationContainer';
import { TransportModeList } from '@/components/logistics/route-optimization/TransportModeList';
import { LogisticsOrdersTable } from '@/components/logistics/orders/LogisticsOrdersTable';
import { DocumentList } from '@/components/logistics/documents/DocumentList';
import { DocumentUpload } from '@/components/logistics/documents/DocumentUpload';
import { LogisticsMetricsGrid } from '@/components/logistics/metrics/LogisticsMetricsGrid';
import { LogisticsMap } from '@/components/logistics/LogisticsMap';
import { LogisticsFilters } from '@/components/logistics/filters/LogisticsFilters';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Package, Route, FileBarChart, AlertCircle, MapPin } from 'lucide-react';
import { CarrierPerformanceAnalytics } from '@/components/logistics/analytics/CarrierPerformanceAnalytics';
import { WeatherImpactAnalysis } from '@/components/logistics/analytics/WeatherImpactAnalysis';
import { RealTimeNotifications } from '@/components/logistics/notifications/RealTimeNotifications';
import { PredictiveETA } from '@/components/logistics/predictions/PredictiveETA';
import { CarbonFootprintTracker } from '@/components/logistics/sustainability/CarbonFootprintTracker';

const Logistics = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.${key}`, language) || key;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-dtwin-medium/10 rounded-full">
              <Truck className="h-6 w-6 text-dtwin-dark" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {getTranslation('navigationItems.logistics', language)}
              </h1>
              <p className="text-muted-foreground">
                {t('optimizeSupplyChain')}
              </p>
            </div>
          </div>
          <LogisticsFilters />
        </div>

        <LogisticsMetricsGrid />
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full justify-start mb-2 bg-transparent border-b rounded-none p-0 h-auto">
            <TabsTrigger value="dashboard" className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10">
              {t('dashboard')}
            </TabsTrigger>
            <TabsTrigger value="tracking" className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10">
              {t('tracking')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10">
              {t('analytics')}
            </TabsTrigger>
            <TabsTrigger value="sustainability" className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10">
              {t('sustainability')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-0 border rounded-tl-none bg-background">
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 overflow-hidden border-none shadow-md">
                  <CardContent className="p-0">
                    <LogisticsMap />
                  </CardContent>
                </Card>
                <div className="lg:col-span-1">
                  <RealTimeNotifications />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PredictiveETA />
                <WeatherImpactAnalysis />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-lg font-semibold flex items-center">
                  <Package className="h-5 w-5 mr-2 text-dtwin-medium" />
                  {t('recentShipments')}
                </h2>
                <LogisticsOrdersTable />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tracking" className="mt-0 border rounded-tl-none bg-background">
            <div className="p-4 space-y-6">
              <Card className="shadow-md">
                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 p-1">
                    <TabsTrigger value="orders" className="flex items-center gap-1.5">
                      <Package className="h-4 w-4" />
                      <span>{t('orders')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                      <span>{t('documents')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="routes" className="flex items-center gap-1.5">
                      <Route className="h-4 w-4" />
                      <span>{t('routes')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="transport" className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>
                      <span>{t('transport')}</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="orders" className="space-y-4 pt-4 px-4 pb-4">
                    <LogisticsOrdersTable />
                  </TabsContent>
                  <TabsContent value="documents" className="space-y-4 pt-4 px-4 pb-4">
                    <DocumentUpload />
                    <DocumentList />
                  </TabsContent>
                  <TabsContent value="routes" className="space-y-4 pt-4 px-4 pb-4">
                    <RouteOptimizationContainer />
                  </TabsContent>
                  <TabsContent value="transport" className="space-y-4 pt-4 px-4 pb-4">
                    <TransportModeList />
                  </TabsContent>
                </Tabs>
              </Card>
              
              <Card className="shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <LogisticsMap />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0 border rounded-tl-none bg-background">
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CarrierPerformanceAnalytics />
                <WeatherImpactAnalysis />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <Card className="shadow-md">
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <FileBarChart className="h-5 w-5 mr-2 text-dtwin-medium" />
                      {t('deliveryPerformance')}
                    </h2>
                    <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
                      <span className="text-muted-foreground">
                        {t('advancedAnalytics')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="shadow-md lg:col-span-2">
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-dtwin-medium" />
                      {t('geographicDistribution')}
                    </h2>
                    <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
                      <span className="text-muted-foreground">
                        {t('heatmapAnalytics')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md">
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-dtwin-medium" />
                      {t('riskAnalysis')}
                    </h2>
                    <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
                      <span className="text-muted-foreground">
                        {t('deliveryRiskAssessment')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sustainability" className="mt-0 border rounded-tl-none bg-background">
            <div className="p-4 space-y-6">
              <CarbonFootprintTracker />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                      {t('sustainableRouting')}
                    </h2>
                    <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
                      <span className="text-muted-foreground">
                        {t('ecoRoutingOptions')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md">
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                      {t('sustainabilityReporting')}
                    </h2>
                    <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
                      <span className="text-muted-foreground">
                        {t('environmentalReports')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Logistics;
