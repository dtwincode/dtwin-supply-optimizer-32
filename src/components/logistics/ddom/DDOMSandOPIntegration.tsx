
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  TrendingUp, 
  BarChart, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Sample S&OP cycle data
const sopCycles = [
  {
    id: 1,
    name: 'Monthly S&OP Cycle',
    nextDate: '2024-07-15',
    lastCompleted: '2024-06-15',
    status: 'on-track'
  },
  {
    id: 2,
    name: 'Quarterly Strategic Review',
    nextDate: '2024-09-01',
    lastCompleted: '2024-06-01',
    status: 'upcoming'
  }
];

// Sample reconciliation data
const reconciliationMetrics = [
  {
    id: 'supply-demand',
    name: 'Supply-Demand Balance',
    value: 87,
    target: 95,
    status: 'warning'
  },
  {
    id: 'buffer-alignment',
    name: 'Buffer Alignment',
    value: 92,
    target: 90,
    status: 'success'
  },
  {
    id: 'financial-reconciliation',
    name: 'Financial Reconciliation',
    value: 84,
    target: 85,
    status: 'warning'
  }
];

// Sample strategic adjustments
const strategicAdjustments = [
  {
    id: 1,
    description: 'Increase safety stock for high-volatility items',
    impact: 'medium',
    status: 'pending',
    date: '2024-06-25'
  },
  {
    id: 2,
    description: 'Adjust replenishment frequency for seasonal products',
    impact: 'high',
    status: 'approved',
    date: '2024-06-22'
  },
  {
    id: 3,
    description: 'Review buffer profiles for electronic components',
    impact: 'medium',
    status: 'pending',
    date: '2024-06-20'
  },
  {
    id: 4,
    description: 'Adjust lead time factors for overseas suppliers',
    impact: 'high',
    status: 'in-review',
    date: '2024-06-18'
  }
];

export const DDOMSandOPIntegration: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.ddom.${key}`, language) || key;
  const [activeTab, setActiveTab] = useState('cycles');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track':
        return <Badge className="bg-green-600">{t('onTrack')}</Badge>;
      case 'warning':
        return <Badge className="bg-amber-600">{t('warning')}</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('upcoming')}</Badge>;
      case 'success':
        return <Badge className="bg-green-600">{t('success')}</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">{t('pending')}</Badge>;
      case 'approved':
        return <Badge className="bg-green-600">{t('approved')}</Badge>;
      case 'in-review':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('inReview')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

  const handleReconciliationClick = () => {
    toast.success(t('reconciliationStarted'));
  };

  const handleViewProjections = () => {
    toast.info(t('projectionsLoaded'));
  };

  const handleReviewAdjustment = (id: number) => {
    toast.success(t('adjustmentReviewed', { id }));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-dtwin-medium" />
            {t('sandopIntegration')}
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {t('active')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="cycles" onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="cycles">{t('sopCycles')}</TabsTrigger>
              <TabsTrigger value="reconciliation">{t('reconciliation')}</TabsTrigger>
              <TabsTrigger value="adjustments">{t('tacticalAdjustments')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cycles" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="space-y-4">
                {sopCycles.map((cycle) => (
                  <div key={cycle.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <p className="font-medium">{cycle.name}</p>
                          <div className="ml-2">
                            {getStatusBadge(cycle.status)}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{t('nextCycle')}: {cycle.nextDate}</span>
                          <Calendar className="h-3 w-3 mr-1 ml-2" />
                          <span>{t('lastCompleted')}: {cycle.lastCompleted}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={handleViewProjections} className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {t('viewDetails')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleViewProjections}>
                  <TrendingUp className="h-4 w-4" />
                  {t('viewProjections')}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  {t('scenarioPlanning')}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reconciliation" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {reconciliationMetrics.map((metric) => (
                  <div key={metric.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">{metric.name}</p>
                      <span className="text-sm font-semibold">
                        {metric.value}%
                      </span>
                    </div>
                    <Progress 
                      value={metric.value} 
                      max={100} 
                      className={`h-2 ${
                        metric.status === 'success' 
                          ? 'bg-green-500' 
                          : metric.status === 'warning' 
                            ? 'bg-amber-500' 
                            : 'bg-red-500'
                      }`} 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{t('target')}: {metric.target}%</span>
                      <div className="flex items-center">
                        <span className="mr-2">{t('status')}:</span>
                        {getStatusBadge(metric.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border rounded-md p-3 mb-4">
                <h3 className="text-sm font-medium mb-2">{t('lastDdmrpReconciliation')}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">May 30, 2024</span>
                  <Button size="sm" variant="default" onClick={handleReconciliationClick}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('startReconciliation')}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  {t('demandSupplyReconciliation')}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('reconciliationReport')}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="adjustments" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="space-y-4">
                {strategicAdjustments.map((adjustment) => (
                  <div key={adjustment.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center">
                          <AlertCircle className={`h-4 w-4 mr-2 ${
                            adjustment.impact === 'high' 
                              ? 'text-red-500' 
                              : adjustment.impact === 'medium' 
                                ? 'text-amber-500' 
                                : 'text-green-500'
                          }`} />
                          <p className="font-medium text-sm">{adjustment.description}</p>
                        </div>
                        <div className="flex items-center mt-1">
                          {getImpactBadge(adjustment.impact)}
                          <span className="ml-2 text-xs text-muted-foreground">{adjustment.date}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {getStatusBadge(adjustment.status)}
                        {adjustment.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs mt-1"
                            onClick={() => handleReviewAdjustment(adjustment.id)}
                          >
                            {t('review')}
                          </Button>
                        )}
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
