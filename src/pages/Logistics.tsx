
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

const Logistics = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {getTranslation('navigationItems.logistics', language)}
            </h1>
            <p className="text-muted-foreground">
              {getTranslation('common.logistics.optimizeSupplyChain', language)}
            </p>
          </div>
          <LogisticsFilters />
        </div>

        <LogisticsMetricsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LogisticsMap />
          <div className="lg:col-span-1">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders">{getTranslation('common.logistics.orders', language)}</TabsTrigger>
                <TabsTrigger value="documents">{getTranslation('common.logistics.documents', language)}</TabsTrigger>
                <TabsTrigger value="routes">{getTranslation('common.logistics.routes', language)}</TabsTrigger>
                <TabsTrigger value="transport">{getTranslation('common.logistics.transport', language)}</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="space-y-4 pt-4">
                <LogisticsOrdersTable />
              </TabsContent>
              <TabsContent value="documents" className="space-y-4 pt-4">
                <DocumentUpload />
                <DocumentList />
              </TabsContent>
              <TabsContent value="routes" className="space-y-4 pt-4">
                <RouteOptimizationContainer />
              </TabsContent>
              <TabsContent value="transport" className="space-y-4 pt-4">
                <TransportModeList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Logistics;
