import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';

interface KPIData {
  avgDoS: number;
  redBuffersCount: number;
  atRiskCount: number;
  atRiskPercent: number;
  coverageTrend: number;
  totalSKUs: number;
  greenPercent: number;
  yellowPercent: number;
  redPercent: number;
}

interface CoverageKPICardsProps {
  data: KPIData;
  onCardClick: (filter: string) => void;
}

export const CoverageKPICards: React.FC<CoverageKPICardsProps> = ({ data, onCardClick }) => {
  const getDoSColor = (dos: number) => {
    if (dos < 7) return 'text-red-600 bg-red-50 border-red-200';
    if (dos < 14) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Avg Days of Supply */}
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${getDoSColor(data.avgDoS)} border-2`}
        onClick={() => onCardClick('all')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">Avg Days of Supply</p>
              <p className="text-3xl font-bold mt-2">{data.avgDoS.toFixed(1)}</p>
              <p className="text-xs mt-1 opacity-70">days</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-20" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  fill="none"
                  strokeDasharray={`${(data.avgDoS / 30) * 175.93} 175.93`}
                  className="transition-all duration-300"
                />
              </svg>
              <ShieldCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Red Buffers Count */}
      <Card 
        className="cursor-pointer transition-all hover:shadow-md bg-red-50 border-2 border-red-200"
        onClick={() => onCardClick('red')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Red Zone SKUs</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{data.redBuffersCount}</p>
              <p className="text-xs text-red-600 mt-1">{data.redPercent.toFixed(1)}% of portfolio</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* At-Risk SKUs */}
      <Card 
        className="cursor-pointer transition-all hover:shadow-md bg-yellow-50 border-2 border-yellow-200"
        onClick={() => onCardClick('at-risk')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">At-Risk SKUs (&lt; DLT)</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{data.atRiskCount}</p>
              <p className="text-xs text-yellow-600 mt-1">{data.atRiskPercent.toFixed(1)}% need action</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Trend */}
      <Card 
        className="cursor-pointer transition-all hover:shadow-md border-2"
        onClick={() => onCardClick('trend')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Coverage Trend (7d)</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-3xl font-bold">{data.coverageTrend > 0 ? '+' : ''}{data.coverageTrend.toFixed(1)}</p>
                {data.coverageTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">days vs last week</p>
            </div>
            <div className="w-16 h-12">
              {/* Mini sparkline */}
              <svg className="w-full h-full" viewBox="0 0 60 40" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={data.coverageTrend >= 0 ? "#16a34a" : "#dc2626"}
                  strokeWidth="2"
                  points="0,30 10,28 20,25 30,22 40,18 50,15 60,10"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
