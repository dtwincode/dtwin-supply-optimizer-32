
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/contexts/I18nContext';

export interface BufferVisualizerProps {
  redZone?: number;
  yellowZone?: number;
  greenZone?: number;
  currentLevel?: number;
  onTargetZone?: number;
}

export const BufferVisualizer: React.FC<BufferVisualizerProps> = ({
  redZone = 20,
  yellowZone = 30,
  greenZone = 50,
  currentLevel = 45,
  onTargetZone = 60
}) => {
  const { t } = useI18n();
  const totalZone = redZone + yellowZone + greenZone;
  
  // Calculate percentages for visualization
  const redPercent = (redZone / totalZone) * 100;
  const yellowPercent = (yellowZone / totalZone) * 100;
  const greenPercent = (greenZone / totalZone) * 100;
  
  // Calculate current level as percentage of total
  const currentLevelPercent = (currentLevel / totalZone) * 100;
  const onTargetPercent = (onTargetZone / totalZone) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{t('inventory.bufferVisualization')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Buffer Zone Visualization */}
          <div className="relative h-12">
            <div className="absolute bottom-0 left-0 right-0 flex h-8 overflow-hidden rounded-md">
              <div 
                className="bg-red-500 h-full" 
                style={{ width: `${redPercent}%` }}
                title={`${t('inventory.redZone')}: ${redZone} units`}
              ></div>
              <div 
                className="bg-yellow-500 h-full" 
                style={{ width: `${yellowPercent}%` }}
                title={`${t('inventory.yellowZone')}: ${yellowZone} units`}
              ></div>
              <div 
                className="bg-green-500 h-full" 
                style={{ width: `${greenPercent}%` }}
                title={`${t('inventory.greenZone')}: ${greenZone} units`}
              ></div>
            </div>
            
            {/* Current Level Indicator */}
            <div 
              className="absolute bottom-0 h-12 w-1 bg-black"
              style={{ left: `calc(${currentLevelPercent}% - 1px)` }}
              title={`${t('inventory.currentLevel')}: ${currentLevel} units`}
            ></div>
            
            {/* Target Level Indicator */}
            <div 
              className="absolute bottom-0 h-12 w-1 border-l-2 border-dashed border-blue-700"
              style={{ left: `calc(${onTargetPercent}% - 1px)` }}
              title={`${t('inventory.targetLevel')}: ${onTargetZone} units`}
            ></div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-red-500 mr-1 rounded-sm"></div>
              <span>{t('inventory.redZone')}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-yellow-500 mr-1 rounded-sm"></div>
              <span>{t('inventory.yellowZone')}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 mr-1 rounded-sm"></div>
              <span>{t('inventory.greenZone')}</span>
            </div>
          </div>
          
          {/* Current and Target Legend */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="h-3 w-1 bg-black mr-1"></div>
              <span>{t('inventory.currentLevel') || 'Current'}: {currentLevel}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-1 border-l-2 border-dashed border-blue-700 mr-1"></div>
              <span>{t('inventory.targetLevel') || 'Target'}: {onTargetZone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
