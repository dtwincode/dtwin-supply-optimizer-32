
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Info } from "lucide-react";
import { SKUClassification } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SKUClassificationsProps {
  classifications: SKUClassification[];
}

export function SKUClassifications({ classifications }: SKUClassificationsProps) {
  const getClassificationBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getClassificationTooltip = (type: string, level: string) => {
    const tooltips = {
      leadTime: {
        high: 'Lead time > 30 days',
        medium: 'Lead time 15-30 days',
        low: 'Lead time < 15 days'
      },
      variability: {
        high: 'COV > 1',
        medium: 'COV 0.5-1',
        low: 'COV < 0.5'
      },
      criticality: {
        high: 'Strategic item',
        medium: 'Important item',
        low: 'Standard item'
      }
    };
    return tooltips[type as keyof typeof tooltips]?.[level] || '';
  };

  return (
    <TooltipProvider>
      <div className="grid gap-4">
        {classifications.map((item) => (
          <Card key={item.sku} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <Tag className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg">{item.sku}</h4>
                    <p className="text-sm text-muted-foreground">
                      Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Classification Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {item.classification.score || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getClassificationBadgeColor(item.classification.leadTimeCategory)}>
                      Lead Time: {item.classification.leadTimeCategory}
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {getClassificationTooltip('leadTime', item.classification.leadTimeCategory)}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getClassificationBadgeColor(item.classification.variabilityLevel)}>
                      Variability: {item.classification.variabilityLevel}
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {getClassificationTooltip('variability', item.classification.variabilityLevel)}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getClassificationBadgeColor(item.classification.criticality)}>
                      Criticality: {item.classification.criticality}
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {getClassificationTooltip('criticality', item.classification.criticality)}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
