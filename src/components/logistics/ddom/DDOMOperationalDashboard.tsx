
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  ArrowUpRight, 
  Zap, 
  Clock, 
  TrendingUp, 
  BarChart, 
  FileBarChart,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Progress } from '@/components/ui/progress';
import { DDOMVarianceChart } from './DDOMVarianceChart';
import { DDOMExecutionMetrics } from './DDOMExecutionMetrics';
import { useQuery } from '@tanstack/react-query';

// Sample data for development
const ddomMetrics = {
  flowIndex: 87,
  tacticalCycleAdherence: 92,
  demandSignalQuality: 78,
  resourceUtilization: 84,
  executionVariance: 6.2,
  adaptiveResponseTime: 4.3,
  planningCycleFrequency: 'Weekly',
};

export const DDOMOperationalDashboard: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.ddom.${key}`, language) || key;

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['ddom-operational-metrics'],
    queryFn: async () => {
      // In a real app, this would fetch from your backend
      return ddomMetrics;
    },
    placeholderData: ddomMetrics,
  });

  const getVarianceClass = (variance: number) => {
    if (variance <= 5) return 'text-green-600';
    if (variance <= 10) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-dtwin-medium" />
          {t('operationalDashboard')}
        </h2>
        <Badge className="bg-blue-600">
          {t('compliantMode')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('flowIndex')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {metrics?.flowIndex}%
              </div>
              <div className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.5%
              </div>
            </div>
            <Progress value={metrics?.flowIndex} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('tacticalCycleAdherence')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {metrics?.tacticalCycleAdherence}%
              </div>
              <div className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +4.1%
              </div>
            </div>
            <Progress value={metrics?.tacticalCycleAdherence} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('executionVariance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className={`text-2xl font-bold ${getVarianceClass(metrics?.executionVariance || 0)}`}>
                {metrics?.executionVariance}%
              </div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {t('improving')}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {t('targetVariance')}: &lt;5%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DDOMVarianceChart />
        <DDOMExecutionMetrics />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-dtwin-medium" />
            {t('adaptiveResponseMetrics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{t('adaptiveResponseTime')}</span>
              <div className="flex items-center mt-1">
                <span className="text-2xl font-semibold">{metrics?.adaptiveResponseTime}</span>
                <span className="text-sm ml-1">{t('hours')}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{t('planningCycleFrequency')}</span>
              <span className="text-2xl font-semibold mt-1">{metrics?.planningCycleFrequency}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{t('demandSignalQuality')}</span>
              <div className="flex items-center mt-1">
                <span className="text-2xl font-semibold">{metrics?.demandSignalQuality}%</span>
                <div className="ml-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
