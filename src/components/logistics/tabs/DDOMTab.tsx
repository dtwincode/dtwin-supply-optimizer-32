
import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { DDOMOperationalDashboard } from '@/components/logistics/ddom/DDOMOperationalDashboard';
import { DDOMCollaborativeExecution } from '@/components/logistics/ddom/DDOMCollaborativeExecution';
import { DDOMSandOPIntegration } from '@/components/logistics/ddom/DDOMSandOPIntegration';
import { DDOMAdaptivePlanning } from '@/components/logistics/ddom/DDOMAdaptivePlanning';
import { Badge } from '@/components/ui/badge';

export const DDOMTab = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.${key}`, language) || key;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Layers className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('ddom.operationalModel')}</h2>
            <p className="text-sm text-muted-foreground">{t('ddom.description')}</p>
          </div>
        </div>
        <Badge className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 h-8">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-medium">DDS&OP Compliant</span>
        </Badge>
      </div>
      
      <DDOMOperationalDashboard />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DDOMCollaborativeExecution />
        <DDOMSandOPIntegration />
      </div>
      
      <DDOMAdaptivePlanning />
    </div>
  );
};
