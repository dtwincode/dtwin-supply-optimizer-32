
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { RefreshCw, Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Sample data for cycle metrics
const cycleMetrics = [
  {
    id: 'cycle-adherence',
    name: 'Cycle Adherence',
    value: 92,
    target: 95,
    status: 'on-track',
    trend: 'improving'
  },
  {
    id: 'response-time',
    name: 'Market Response Time',
    value: 3.5,
    unit: 'days',
    target: '< 5',
    status: 'on-track',
    trend: 'stable'
  },
  {
    id: 'signal-detection',
    name: 'Signal Detection Rate',
    value: 87,
    target: 90,
    status: 'warning',
    trend: 'stable'
  },
  {
    id: 'adjustment-accuracy',
    name: 'Adjustment Accuracy',
    value: 83,
    target: 85,
    status: 'warning',
    trend: 'improving'
  }
];

// Sample planning cycles
const planningCycles = [
  {
    id: 1,
    name: 'Weekly Operational Review',
    frequency: 'Weekly',
    nextDate: '2023-08-10',
    status: 'on-track',
    type: 'operational'
  },
  {
    id: 2,
    name: 'Monthly Tactical Review',
    frequency: 'Monthly',
    nextDate: '2023-08-25',
    status: 'on-track',
    type: 'tactical'
  },
  {
    id: 3,
    name: 'Quarterly Strategic Adjustment',
    frequency: 'Quarterly',
    nextDate: '2023-09-15',
    status: 'upcoming',
    type: 'strategic'
  },
  {
    id: 4,
    name: 'Market Disruption Response',
    frequency: 'As Needed',
    nextDate: 'On Demand',
    status: 'standby',
    type: 'adaptive'
  }
];

// Sample market signals
const marketSignals = [
  {
    id: 1,
    name: 'Supplier Lead Time Increase',
    impact: 'high',
    detectedDate: '2023-08-01',
    status: 'pending-action',
    category: 'supply'
  },
  {
    id: 2,
    name: 'Regional Demand Spike',
    impact: 'medium',
    detectedDate: '2023-07-28',
    status: 'in-assessment',
    category: 'demand'
  },
  {
    id: 3,
    name: 'Competitor Pricing Change',
    impact: 'low',
    detectedDate: '2023-07-25',
    status: 'monitored',
    category: 'market'
  }
];

export const DDOMAdaptivePlanning: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.ddom.${key}`, language) || key;
  const [activeTab, setActiveTab] = useState('cycles');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track':
        return <Badge className="bg-green-600">{t('onTrack')}</Badge>;
      case 'warning':
        return <Badge className="bg-amber-600">{t('warning')}</Badge>;
      case 'alert':
        return <Badge className="bg-red-600">{t('alert')}</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('upcoming')}</Badge>;
      case 'standby':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{t('standby')}</Badge>;
      case 'pending-action':
        return <Badge className="bg-red-600">{t('pendingAction')}</Badge>;
      case 'in-assessment':
        return <Badge className="bg-amber-600">{t('inAssessment')}</Badge>;
      case 'monitored':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('monitored')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <span className="text-green-600 text-xs flex items-center">↑ {t('improving')}</span>;
      case 'declining':
        return <span className="text-red-600 text-xs flex items-center">↓ {t('declining')}</span>;
      case 'stable':
      default:
        return <span className="text-blue-600 text-xs flex items-center">→ {t('stable')}</span>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-600">{t('highImpact')}</Badge>;
      case 'medium':
        return <Badge className="bg-amber-600">{t('mediumImpact')}</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">{t('lowImpact')}</Badge>;
      default:
        return <Badge>{impact}</Badge>;
    }
  };

  const handleTriggerCycle = () => {
    toast.success(t('cycleTriggered'));
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-dtwin-medium" />
          {t('adaptivePlanning')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="cycles" onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="cycles">{t('planningCycles')}</TabsTrigger>
              <TabsTrigger value="metrics">{t('cycleMetrics')}</TabsTrigger>
              <TabsTrigger value="signals">{t('marketSignals')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cycles" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="space-y-4">
                {planningCycles.map((cycle) => (
                  <div key={cycle.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <p className="font-medium">{cycle.name}</p>
                          {getStatusBadge(cycle.status)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{t('frequency')}: {cycle.frequency}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{t('nextCycle')}: {cycle.nextDate}</span>
                        </div>
                      </div>
                      {cycle.type === 'adaptive' && (
                        <Button size="sm" variant="secondary" onClick={handleTriggerCycle}>
                          {t('triggerCycle')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cycleMetrics.map((metric) => (
                  <div key={metric.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{metric.name}</p>
                      <span className="text-lg font-semibold">
                        {metric.unit ? `${metric.value} ${metric.unit}` : `${metric.value}%`}
                      </span>
                    </div>
                    {!metric.unit && (
                      <Progress 
                        value={metric.value} 
                        max={100} 
                        className={`h-2 ${
                          metric.status === 'on-track' 
                            ? 'bg-green-500' 
                            : metric.status === 'warning' 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                        }`} 
                      />
                    )}
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{t('target')}: {metric.target}</span>
                      <div className="flex items-center">
                        <span className="mr-2">{t('trend')}:</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signals" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="space-y-4">
                {marketSignals.map((signal) => (
                  <div key={signal.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center">
                          <AlertCircle className={`h-4 w-4 mr-2 ${
                            signal.impact === 'high' 
                              ? 'text-red-500' 
                              : signal.impact === 'medium' 
                                ? 'text-amber-500' 
                                : 'text-green-500'
                          }`} />
                          <p className="font-medium">{signal.name}</p>
                        </div>
                        <div className="flex items-center mt-1">
                          {getImpactBadge(signal.impact)}
                          <Badge className="ml-2" variant="outline">{signal.category}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">
                          {t('detected')}: {signal.detectedDate}
                        </span>
                        {getStatusBadge(signal.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
