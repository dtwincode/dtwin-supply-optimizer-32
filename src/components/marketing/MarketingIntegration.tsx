
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, ShoppingCart, AlertCircle } from 'lucide-react';

export const MarketingIntegration = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`marketing.${key}`, language) || key;

  // Sample data for integration tabs
  const inventoryAlerts = [
    { id: 1, sku: 'SKU001', name: 'Smartphone X', risk: 'high', requiredBuffer: 250 },
    { id: 2, sku: 'SKU003', name: 'Tablet Pro', risk: 'medium', requiredBuffer: 120 },
    { id: 3, sku: 'SKU010', name: 'Headphones', risk: 'low', requiredBuffer: 80 },
  ];

  const forecastUpdates = [
    { id: 1, campaign: 'Black Friday', forecast: '+25%', products: 'Electronics', confidence: 'high' },
    { id: 2, campaign: 'Summer Sale', forecast: '+18%', products: 'Outdoor items', confidence: 'medium' },
    { id: 3, campaign: 'Holiday Season', forecast: '+32%', products: 'Gift items', confidence: 'high' },
  ];

  const supplyRequirements = [
    { id: 1, item: 'Smartphone X', additionalUnits: 5000, leadTime: '45 days', status: 'at risk' },
    { id: 2, item: 'Tablets', additionalUnits: 2200, leadTime: '30 days', status: 'on track' },
    { id: 3, item: 'Headphones', additionalUnits: 8000, leadTime: '20 days', status: 'on track' },
  ];

  // Get badge variant based on risk level
  const getRiskBadge = (risk) => {
    switch(risk) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {t('supplyChainIntegration')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs defaultValue="inventory">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="inventory" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              {t('inventory')}
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {t('forecast')}
            </TabsTrigger>
            <TabsTrigger value="supply" className="text-xs">
              <ShoppingCart className="h-3 w-3 mr-1" />
              {t('supply')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="mt-0">
            <div className="text-xs text-muted-foreground mb-2">
              {t('inventoryAlerts')}
            </div>
            <div className="space-y-2">
              {inventoryAlerts.map(alert => (
                <div key={alert.id} className="flex justify-between items-center border p-2 rounded-md">
                  <div>
                    <div className="font-medium text-sm">{alert.name}</div>
                    <div className="text-xs text-muted-foreground">{alert.sku}</div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={getRiskBadge(alert.risk)}>
                      {alert.risk}
                    </Badge>
                    <div className="ml-2 text-xs">
                      +{alert.requiredBuffer} units
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="forecast" className="mt-0">
            <div className="text-xs text-muted-foreground mb-2">
              {t('forecastUpdates')}
            </div>
            <div className="space-y-2">
              {forecastUpdates.map(update => (
                <div key={update.id} className="flex justify-between items-center border p-2 rounded-md">
                  <div>
                    <div className="font-medium text-sm">{update.campaign}</div>
                    <div className="text-xs text-muted-foreground">{update.products}</div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {update.forecast}
                    </Badge>
                    <div className="ml-2 text-xs text-blue-600">
                      {update.confidence}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="supply" className="mt-0">
            <div className="text-xs text-muted-foreground mb-2">
              {t('supplyRequirements')}
            </div>
            <div className="space-y-2">
              {supplyRequirements.map(requirement => (
                <div key={requirement.id} className="flex justify-between items-center border p-2 rounded-md">
                  <div>
                    <div className="font-medium text-sm">{requirement.item}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('leadTime')}: {requirement.leadTime}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium">
                      +{requirement.additionalUnits}
                    </div>
                    <Badge className={`ml-2 ${
                      requirement.status === 'at risk' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {requirement.status === 'at risk' ? (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      ) : null}
                      {requirement.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
