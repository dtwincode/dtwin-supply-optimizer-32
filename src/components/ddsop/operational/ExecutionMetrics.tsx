
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Zap, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getStatusBadge, getTrendIcon } from '@/utils/ddsopUIUtils';
import { executionItems } from '@/data/ddsopMetricsData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Add recommendation logic based on status and trend
const getRecommendation = (status: string, trend: string, metric: string, target: string) => {
  if (status === 'alert') {
    return 'immediate-action';
  } else if (status === 'warning' && trend === 'declining') {
    return 'preventive-action';
  } else if (status === 'warning' && trend === 'stable') {
    return 'monitoring';
  } else if (status === 'on-track' && trend === 'improving') {
    return 'maintain';
  } else {
    return 'review';
  }
};

export const ExecutionMetrics: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;
  const [viewMode, setViewMode] = useState<'metrics' | 'actions'>('metrics');

  // Generate action-oriented data with recommendations
  const executionWithRecommendations = executionItems.map(item => {
    const recommendation = getRecommendation(item.status, item.trend, item.metric, item.target);
    return {
      ...item,
      recommendation,
      actionDescription: 
        recommendation === 'immediate-action' 
          ? t('immediateActionNeeded') 
        : recommendation === 'preventive-action'
          ? t('preventiveActionRecommended')
        : recommendation === 'monitoring'
          ? t('continuedMonitoringAdvised')
        : recommendation === 'maintain'
          ? t('maintainCurrentApproach')
        : t('reviewAndAnalyze')
    };
  });

  // Sort items by priority (alert first, then warning, then on-track)
  const sortedItems = [...executionWithRecommendations].sort((a, b) => {
    const priorityOrder = { 'alert': 0, 'warning': 1, 'on-track': 2 };
    return priorityOrder[a.status] - priorityOrder[b.status];
  });

  const handleTakeAction = (itemId: number) => {
    toast.success(t('actionInitiated'));
    // In a real application, this would open a dialog or navigate to an action page
  };

  const getActionIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'immediate-action':
        return <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />;
      case 'preventive-action':
        return <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />;
      case 'monitoring':
        return <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />;
      case 'maintain':
        return <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-600 mr-2" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-dtwin-medium" />
            {t('executionMetrics')}
          </CardTitle>
          <div className="flex bg-muted rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'metrics' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('metrics')}
              className="text-xs px-3"
            >
              {t('metrics')}
            </Button>
            <Button 
              variant={viewMode === 'actions' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('actions')}
              className="text-xs px-3"
            >
              {t('actions')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[300px]">
          {viewMode === 'metrics' ? (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 font-medium text-muted-foreground">{t('metric')}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t('status')}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t('actual')}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t('target')}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t('trend')}</th>
                </tr>
              </thead>
              <tbody>
                {executionItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{t(item.name.toLowerCase().replace(/\s+/g, ''))}</td>
                    <td className="py-3">{getStatusBadge(item.status, language)}</td>
                    <td className="py-3 text-sm font-medium">{item.metric}</td>
                    <td className="py-3 text-sm text-muted-foreground">{item.target}</td>
                    <td className="py-3">{getTrendIcon(item.trend, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="space-y-4">
              {sortedItems.map((item) => (
                <div key={item.id} className={`border rounded-lg p-4 ${
                  item.status === 'alert' ? 'border-red-200 bg-red-50' : 
                  item.status === 'warning' ? 'border-amber-200 bg-amber-50' : 
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{t(item.name.toLowerCase().replace(/\s+/g, ''))}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-muted-foreground mr-3">
                          {t('current')}: {item.metric}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t('target')}: {item.target}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {getStatusBadge(item.status, language)}
                      <div className="mt-1">
                        {getTrendIcon(item.trend, language)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex items-center mb-2">
                      {getActionIcon(item.recommendation)}
                      <span className="text-sm font-medium">{item.actionDescription}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`mt-1 ${
                        item.status === 'alert' ? 'border-red-500 text-red-700 hover:bg-red-50' : 
                        item.status === 'warning' ? 'border-amber-500 text-amber-700 hover:bg-amber-50' : 
                        'border-green-500 text-green-700 hover:bg-green-50'
                      }`}
                      onClick={() => handleTakeAction(item.id)}
                    >
                      {t('takeAction')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-2">
        <div className="w-full text-right text-xs text-muted-foreground">
          {viewMode === 'metrics' ? (
            <span>{executionItems.length} {t('metricsDisplayed')}</span>
          ) : (
            <span>{sortedItems.filter(i => i.status === 'alert').length} {t('criticalItems')}, {sortedItems.filter(i => i.status === 'warning').length} {t('warningItems')}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
