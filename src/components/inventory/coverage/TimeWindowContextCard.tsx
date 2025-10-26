import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Database, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TimeWindowContextCardProps {
  lastUpdated: Date;
  autoRefreshEnabled?: boolean;
  autoRefreshIntervalMinutes?: number;
}

export const TimeWindowContextCard: React.FC<TimeWindowContextCardProps> = ({
  lastUpdated,
  autoRefreshEnabled = true,
  autoRefreshIntervalMinutes = 15
}) => {
  const timeInfo = useMemo(() => {
    const now = new Date();
    const aduEndDate = now;
    const aduStartDate = new Date(now);
    aduStartDate.setDate(aduStartDate.getDate() - 90);
    
    // Calculate current week and quarter
    const weekNumber = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    
    // Calculate time since last update
    const timeSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60));
    const timeDisplay = timeSinceUpdate === 0 ? 'Just now' : 
                       timeSinceUpdate === 1 ? '1 min ago' : 
                       timeSinceUpdate < 60 ? `${timeSinceUpdate} min ago` :
                       `${Math.floor(timeSinceUpdate / 60)}h ${timeSinceUpdate % 60}m ago`;
    
    return {
      aduStartDate,
      aduEndDate,
      weekNumber,
      quarter,
      year: now.getFullYear(),
      timeDisplay,
      timeSinceUpdate
    };
  }, [lastUpdated]);

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ADU Calculation Window */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">ADU Calculation Window</p>
              <p className="text-sm font-bold">90-Day Rolling Average</p>
              <p className="text-xs text-muted-foreground mt-1">
                {timeInfo.aduStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {timeInfo.aduEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Current Period */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">Current Period</p>
              <p className="text-sm font-bold">Week {timeInfo.weekNumber}, Q{timeInfo.quarter} {timeInfo.year}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Data Freshness */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">Data Freshness</p>
              <div className="flex items-center gap-2">
                <Badge variant={timeInfo.timeSinceUpdate < 5 ? "default" : "secondary"} className="text-xs">
                  Real-time
                </Badge>
                <p className="text-sm font-bold">{timeInfo.timeDisplay}</p>
              </div>
              {autoRefreshEnabled && (
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-refresh every {autoRefreshIntervalMinutes} min
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};