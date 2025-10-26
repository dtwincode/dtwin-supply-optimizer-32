import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, HelpCircle } from 'lucide-react';

interface CoverageFooterProps {
  totalItems: number;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  avgDoS: number;
  lastUpdated: Date;
  onExport: () => void;
}

export const CoverageFooter: React.FC<CoverageFooterProps> = ({
  totalItems,
  redCount,
  yellowCount,
  greenCount,
  avgDoS,
  lastUpdated,
  onExport
}) => {
  const redPercent = (redCount / totalItems) * 100;
  const yellowPercent = (yellowCount / totalItems) * 100;
  const greenPercent = (greenCount / totalItems) * 100;

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
              <p className="font-bold text-lg">{avgDoS.toFixed(1)} days</p>
            </div>

            <div className="h-10 w-px bg-border" />

            <div className="text-sm">
              <p className="text-muted-foreground">Total SKUs</p>
              <p className="font-bold text-lg">{totalItems}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              Last Updated: {lastUpdated.toLocaleString()}
            </div>
            
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
  );
};
