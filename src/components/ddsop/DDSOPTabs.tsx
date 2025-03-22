
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OperationalModelTab } from './tabs/OperationalModelTab';
import { SandOPIntegrationTab } from './tabs/SandOPIntegrationTab';
import { CollaborativeExecutionTab } from './tabs/CollaborativeExecutionTab';
import { AdaptivePlanningTab } from './tabs/AdaptivePlanningTab';

export const DDSOPTabs = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.ddsop.${key}`, language) || key;

  useEffect(() => {
    console.log("DDSOPTabs rendered, language:", language);
  }, [language]);

  return (
    <div className="w-full">
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="operational">{t('operationalModel')}</TabsTrigger>
          <TabsTrigger value="integration">{t('sandopIntegration')}</TabsTrigger>
          <TabsTrigger value="execution">{t('collaborativeExecution')}</TabsTrigger>
          <TabsTrigger value="adaptive">{t('adaptivePlanning')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational">
          <OperationalModelTab />
        </TabsContent>
        
        <TabsContent value="integration">
          <SandOPIntegrationTab />
        </TabsContent>
        
        <TabsContent value="execution">
          <CollaborativeExecutionTab />
        </TabsContent>
        
        <TabsContent value="adaptive">
          <AdaptivePlanningTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
