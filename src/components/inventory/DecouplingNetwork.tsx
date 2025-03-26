
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info } from 'lucide-react';

export const DecouplingNetwork = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.inventory.${key}`, language);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('decouplingNetwork')}</CardTitle>
        <CardDescription>
          {t('configureDecouplingPoints')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization">
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">{t('networkVisualization')}</TabsTrigger>
            <TabsTrigger value="nodes">{t('nodes')}</TabsTrigger>
            <TabsTrigger value="links">{t('links')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-4">
            <div className="border rounded-lg p-8 h-[400px] flex items-center justify-center bg-gray-50">
              <div className="text-center space-y-2">
                <Info className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">{t('networkHelp')}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nodes" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">{t('nodes')}</h3>
              <p className="text-muted-foreground mb-4">{t('nodesDescription')}</p>
              
              <div className="space-y-2">
                <div className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Main Warehouse</h4>
                    <p className="text-sm text-muted-foreground">{t('strategicInfo')}</p>
                  </div>
                </div>
                <div className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Distribution Center</h4>
                    <p className="text-sm text-muted-foreground">{t('customerOrderInfo')}</p>
                  </div>
                </div>
                <div className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Retail Store</h4>
                    <p className="text-sm text-muted-foreground">{t('stockPointInfo')}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="links" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">{t('links')}</h3>
              <p className="text-muted-foreground mb-4">{t('linksDescription')}</p>
              
              <div className="space-y-2">
                <div className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Main Warehouse → Distribution Center</h4>
                    <p className="text-sm text-muted-foreground">Replenishment flow</p>
                  </div>
                </div>
                <div className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Distribution Center → Retail Store</h4>
                    <p className="text-sm text-muted-foreground">Distribution flow</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
