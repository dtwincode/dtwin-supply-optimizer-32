
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Route } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { LogisticsOrdersTable } from '@/components/logistics/orders/LogisticsOrdersTable';
import { DocumentList } from '@/components/logistics/documents/DocumentList';
import { DocumentUpload } from '@/components/logistics/documents/DocumentUpload';
import { RouteOptimizationContainer } from '@/components/logistics/route-optimization/RouteOptimizationContainer';
import { TransportModeList } from '@/components/logistics/route-optimization/TransportModeList';
import { LogisticsMap } from '@/components/logistics/LogisticsMap';

export const TrackingTab = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.${key}`, language) || key;

  return (
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
  );
};
