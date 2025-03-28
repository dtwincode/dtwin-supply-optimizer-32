
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import LocationHierarchyUpload from "@/components/settings/location-hierarchy/LocationHierarchyUpload";
import ProductHierarchyUpload from "@/components/settings/product-hierarchy/ProductHierarchyUpload";
import HistoricalSalesUpload from "@/components/settings/historical-sales/HistoricalSalesUpload";
import LeadTimeUpload from "@/components/settings/lead-time/LeadTimeUpload";
import ReplenishmentUpload from "@/components/settings/replenishment/ReplenishmentUpload";
import IntegratedDataPreview from "@/components/settings/integrated-data/IntegratedDataPreview";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("data-upload");
  const { language } = useLanguage();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{getTranslation('settings.title', language)}</h1>
      
      <Tabs defaultValue="data-upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="data-upload">{getTranslation('settings.dataUpload', language)}</TabsTrigger>
          <TabsTrigger value="preferences">{getTranslation('settings.preferences', language)}</TabsTrigger>
          <TabsTrigger value="integration">{getTranslation('settings.integration', language)}</TabsTrigger>
          <TabsTrigger value="users">{getTranslation('settings.users', language)}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data-upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationHierarchyUpload />
            <ProductHierarchyUpload />
            <HistoricalSalesUpload />
            <LeadTimeUpload />
            <ReplenishmentUpload />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{getTranslation('settings.integratedData', language)}</CardTitle>
            </CardHeader>
            <CardContent>
              <IntegratedDataPreview />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{getTranslation('settings.userPreferences', language)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{getTranslation('settings.preferencesContent', language)}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>{getTranslation('settings.apiIntegration', language)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{getTranslation('settings.apiIntegrationContent', language)}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{getTranslation('settings.userManagement', language)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{getTranslation('settings.userManagementContent', language)}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
