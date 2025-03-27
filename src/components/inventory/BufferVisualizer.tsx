
import { useI18n } from "@/contexts/I18nContext";

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: {
    red: number;
    yellow: number;
    green: number;
  };
  adu?: number;
}

export const BufferVisualizer = ({ netFlowPosition, bufferZones, adu }: BufferVisualizerProps) => {
  const { t } = useI18n();
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  
  // Calculate percentages for visualization
  const redPercent = Math.round((bufferZones.red / totalBuffer) * 100);
  const yellowPercent = Math.round((bufferZones.yellow / totalBuffer) * 100);
  const greenPercent = Math.round((bufferZones.green / totalBuffer) * 100);
  
  // Calculate net flow position as a percentage of total buffer
  const netFlowPercent = Math.min(100, Math.max(0, (netFlowPosition / totalBuffer) * 100));
  
  return (
    <div className="w-full">
      <div className="flex mb-1">
        <div 
          className="h-3 bg-red-500 rounded-l" 
          style={{ width: `${redPercent}%` }}
          title={`${t("common.zones.red")}: ${bufferZones.red}`}
        ></div>
        <div 
          className="h-3 bg-yellow-500" 
          style={{ width: `${yellowPercent}%` }}
          title={`${t("common.zones.yellow")}: ${bufferZones.yellow}`}
        ></div>
        <div 
          className="h-3 bg-green-500 rounded-r" 
          style={{ width: `${greenPercent}%` }}
          title={`${t("common.zones.green")}: ${bufferZones.green}`}
        ></div>
      </div>
      
      <div className="relative h-1 bg-gray-200 rounded">
        <div 
          className="absolute top-0 h-3 w-1 bg-black rounded-full transform -translate-y-1" 
          style={{ left: `${netFlowPercent}%` }}
          title={`${t("common.inventory.netFlowPosition")}: ${netFlowPosition}`}
        ></div>
      </div>
      
      <div className="flex text-xs mt-1 justify-between">
        <span className="text-gray-500">{`0${adu ? ` (${adu}/day)` : ''}`}</span>
        <span className="text-gray-500">{totalBuffer}</span>
      </div>
    </div>
  );
};
