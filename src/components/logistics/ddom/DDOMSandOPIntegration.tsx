
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, BarChart, ArrowUpDown, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const DDOMSandOPIntegration: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.ddom.${key}`, language) || key;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-dtwin-medium" />
            {t('sandopIntegration')}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    <Info className="h-3 w-3 mr-1" />
                    {t('inDevelopment')}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('sandopIntegrationTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">{t('nextSandopCycle')}</span>
              <span className="text-sm">June 15, 2024</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">{t('lastDdmrpReconciliation')}</span>
              <span className="text-sm">May 30, 2024</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">{t('tacticalAdjustments')}</span>
              <span className="text-sm">8 pending</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('strategicReview')}</span>
              <span className="text-sm">Quarterly (Next: July 1)</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('viewProjections')}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              {t('scenarioPlanning')}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {t('demandSupplyReconciliation')}
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">{t('implementation')}</h4>
            <p className="text-xs text-muted-foreground">
              {t('sandopIntegrationDescription')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
