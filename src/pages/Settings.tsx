
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import LeadTimeUpload from '@/components/settings/lead-time/LeadTimeUpload';
import ReplenishmentUpload from '@/components/settings/replenishment/ReplenishmentUpload';
import LocationHierarchyUpload from '@/components/settings/location-hierarchy/LocationHierarchyUpload';
import HistoricalSalesUpload from '@/components/settings/historical-sales/HistoricalSalesUpload';
import { DataUploadDialog } from '@/components/settings/DataUploadDialog';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

const Settings = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`settings.${key}`, language);
  const [isDataUploadOpen, setIsDataUploadOpen] = useState(false);
  
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        
        <Tabs defaultValue="historical" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="master">{t('tabs.masterData')}</TabsTrigger>
            <TabsTrigger value="historical">{t('tabs.historicalData')}</TabsTrigger>
            <TabsTrigger value="settings">{t('tabs.settings')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="master" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('masterData.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{t('masterData.description')}</p>
                <Grid className="gap-4 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('masterData.productHierarchy')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LocationHierarchyUpload />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('masterData.locationHierarchy')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LocationHierarchyUpload />
                    </CardContent>
                  </Card>
                </Grid>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('historicalData.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{t('historicalData.description')}</p>
                <Grid className="gap-4 grid-cols-1 md:grid-cols-2">
                  <HistoricalSalesUpload />
                  <LeadTimeUpload />
                  <ReplenishmentUpload />
                </Grid>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <DataUploadDialog 
                  open={isDataUploadOpen} 
                  onOpenChange={setIsDataUploadOpen}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
