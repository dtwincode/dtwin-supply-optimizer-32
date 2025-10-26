import React, { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import { CoverageItem } from './CoverageTable';
import { getTimeContext } from '@/utils/timeUtils';

interface PredictiveAlertsProps {
  items: CoverageItem[];
  onViewAtRisk: () => void;
}

export const PredictiveAlerts: React.FC<PredictiveAlertsProps> = ({ items, onViewAtRisk }) => {
  const projectedBreaches = useMemo(() => {
    return items
      .map(item => {
        const tor = item.tor || (item.dlt * item.adu * 0.5);
        const daysUntilBreach = item.adu > 0 ? (item.nfp - tor) / item.adu : 999;
        
        return {
          ...item,
          daysUntilBreach,
          willBreach: daysUntilBreach > 0 && daysUntilBreach <= 3 && item.on_order === 0
        };
      })
      .filter(item => item.willBreach)
      .sort((a, b) => a.daysUntilBreach - b.daysUntilBreach);
  }, [items]);

  if (projectedBreaches.length === 0) return null;

  return (
    <Alert variant="default" className="border-orange-500 bg-orange-50">
      <AlertTriangle className="h-5 w-5 text-orange-600" />
      <AlertTitle className="text-orange-900 font-bold">
        ⚠️ Predictive Breach Alert
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-3">
          <p className="text-sm text-orange-800">
            {projectedBreaches.length} items will breach the RED zone within the next 3 days with no orders in transit.
          </p>
          
          <div className="bg-white rounded-md p-3 space-y-2 max-h-32 overflow-y-auto">
            {projectedBreaches.slice(0, 5).map(item => (
              <div key={`${item.product_id}-${item.location_id}`} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-orange-600" />
                  <span className="font-mono font-semibold">{item.sku}</span>
                  <span className="text-muted-foreground">{item.location_id}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-700">
                    {item.daysUntilBreach.toFixed(1)} days
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {getTimeContext(item.daysUntilBreach)}
                  </div>
                </div>
              </div>
            ))}
            {projectedBreaches.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-1 border-t">
                +{projectedBreaches.length - 5} more items at risk
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={onViewAtRisk}
              className="border-orange-600 text-orange-700 hover:bg-orange-100"
            >
              Review All {projectedBreaches.length} Items
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
