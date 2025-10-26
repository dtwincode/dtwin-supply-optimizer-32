import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, HelpCircle, Database, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDaysWithWeeks } from '@/utils/timeUtils';

interface CoverageFooterProps {
  totalItems: number;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  avgDoS: number;
  lastUpdated: Date;
  onExport: () => void;
  autoRefreshEnabled?: boolean;
  autoRefreshIntervalMinutes?: number;
}

export const CoverageFooter: React.FC<CoverageFooterProps> = ({
  totalItems,
  redCount,
  yellowCount,
  greenCount,
  avgDoS,
  lastUpdated,
  onExport,
  autoRefreshEnabled = true,
  autoRefreshIntervalMinutes = 15
}) => {
  const redPercent = (redCount / totalItems) * 100;
  const yellowPercent = (yellowCount / totalItems) * 100;
  const greenPercent = (greenCount / totalItems) * 100;

  // Calculate data window and time info
  const dataInfo = useMemo(() => {
    const now = new Date();
    const aduEndDate = now;
    const aduStartDate = new Date(now);
    aduStartDate.setDate(aduStartDate.getDate() - 90);
    
    const timeSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60));
    const timeDisplay = timeSinceUpdate === 0 ? 'just now' : 
                       timeSinceUpdate === 1 ? '1 min ago' : 
                       timeSinceUpdate < 60 ? `${timeSinceUpdate} min ago` :
                       `${Math.floor(timeSinceUpdate / 60)}h ago`;
    
    return {
      aduWindow: `${aduStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${aduEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      timeDisplay,
      isRecent: timeSinceUpdate < 5
    };
  }, [lastUpdated]);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background border-t shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Buffer Health Pie */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="transform -rotate-90 w-12 h-12">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeDasharray={`${greenPercent * 1.256} 125.6`}
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="4"
                    strokeDasharray={`${yellowPercent * 1.256} 125.6`}
                    strokeDashoffset={`-${greenPercent * 1.256}`}
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeDasharray={`${redPercent * 1.256} 125.6`}
                    strokeDashoffset={`-${(greenPercent + yellowPercent) * 1.256}`}
                  />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-semibold">Buffer Health</p>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-600">🟢 {greenPercent.toFixed(0)}%</span>
                  <span className="text-yellow-600">🟡 {yellowPercent.toFixed(0)}%</span>
                  <span className="text-red-600">🔴 {redPercent.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-border" />

            <div className="text-sm">
              <p className="text-muted-foreground">Average Coverage</p>
              <p className="font-bold text-lg">{formatDaysWithWeeks(avgDoS)}</p>
            </div>

            <div className="h-10 w-px bg-border" />

            <div className="text-sm">
              <p className="text-muted-foreground">Total SKUs</p>
              <p className="font-bold text-lg">{totalItems}</p>
            </div>
          </div>

          {/* Data Transparency & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Data Window:</span>
                <span className="font-medium">{dataInfo.aduWindow}</span>
                <span className="text-muted-foreground">(90 days)</span>
              </div>
              
              <div className="h-4 w-px bg-border" />
              
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <Badge variant={dataInfo.isRecent ? "default" : "secondary"} className="text-xs h-5">
                  {dataInfo.timeDisplay}
                </Badge>
              </div>
              
              {autoRefreshEnabled && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Auto-refresh:</span>
                    <Badge variant="outline" className="text-xs h-5">
                      ON ({autoRefreshIntervalMinutes} min)
                    </Badge>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
