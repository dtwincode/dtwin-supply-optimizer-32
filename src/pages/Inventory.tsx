
import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BufferManagementContent } from '@/components/inventory/buffer/BufferManagementContent';
import { SKUClassifications } from '@/components/inventory/classification/SKUClassifications';
import { useI18n } from '@/contexts/I18nContext';

const Inventory: React.FC = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    searchParams.set('tab', value);
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('inventory.inventoryManagement')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('inventory.management.description') || 'Manage your inventory, buffer zones, and SKU classifications.'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('common.overview')}</TabsTrigger>
            <TabsTrigger value="buffers">{t('inventory.bufferZones')}</TabsTrigger>
            <TabsTrigger value="classification">{t('inventory.classification')}</TabsTrigger>
            <TabsTrigger value="decoupling">{t('inventory.decouplingPoint')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-2">{t('inventory.overview.title') || 'Inventory Overview'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('inventory.overview.description') || 'This section is under development. Please check the other tabs for available features.'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="buffers" className="space-y-4">
            <BufferManagementContent />
          </TabsContent>

          <TabsContent value="classification" className="space-y-4">
            <SKUClassifications />
          </TabsContent>

          <TabsContent value="decoupling" className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">{t('inventory.decoupling.title') || 'Decoupling Point Management'}</h3>
              <p className="text-sm text-muted-foreground">
                {t('inventory.decoupling.description') || 'This section is under development. Please check back later.'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
