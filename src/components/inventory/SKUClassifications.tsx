
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Info, Award, TrendingUp } from "lucide-react";
import { SKUClassification } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    return tooltips[type as keyof typeof tooltips]?.[level as keyof typeof tooltips[keyof typeof tooltips]] || '';
  };

  // Animation variants for cards - properly typed for framer-motion
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-blue-600";
    if (score >= 60) return "text-indigo-600";
    if (score >= 40) return "text-purple-600";
    return "text-gray-600";
  };

  // Different background styles for cards
  const cardBackgrounds = [
    "bg-gradient-to-r from-blue-50 to-indigo-50",
    "bg-gradient-to-r from-purple-50 to-pink-50",
    "bg-gradient-to-r from-green-50 to-emerald-50"
  ];

  // Helper function to map leadTimeCategory to high/medium/low for visual consistency
  const mapLeadTimeCategoryToLevel = (category: 'short' | 'medium' | 'long'): 'low' | 'medium' | 'high' => {
    switch (category) {
      case 'short': return 'low';
      case 'medium': return 'medium';
      case 'long': return 'high';
      default: return 'medium' as 'medium';
    }
  };

  return (
    <TooltipProvider>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {classifications.map((classItem, index) => (
          <motion.div key={classItem.sku} variants={item}>
            <Card className={cn("overflow-hidden transition-all hover:shadow-lg", cardBackgrounds[index % cardBackgrounds.length])}>
              {/* Header with Score */}
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <Tag className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium">{classItem.sku}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">Score</span>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className={cn("text-lg font-bold", getScoreColor(classItem.classification.score || 0))}>
                      {classItem.classification.score || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Classification Details */}
              <div className="p-4 space-y-3">
                {/* Lead Time */}
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                  <div className={cn("h-8 w-1 rounded-full", 
                    mapLeadTimeCategoryToLevel(classItem.classification.leadTimeCategory) === 'high' ? 'bg-red-400' : 
                    mapLeadTimeCategoryToLevel(classItem.classification.leadTimeCategory) === 'medium' ? 'bg-yellow-400' : 
                    'bg-green-400')} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Lead Time</span>
                      <Badge className={getClassificationBadgeColor(mapLeadTimeCategoryToLevel(classItem.classification.leadTimeCategory))}>
                        {mapLeadTimeCategoryToLevel(classItem.classification.leadTimeCategory)}
                      </Badge>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {getClassificationTooltip('leadTime', mapLeadTimeCategoryToLevel(classItem.classification.leadTimeCategory))}
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {/* Variability */}
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                  <div className={cn("h-8 w-1 rounded-full", 
                    classItem.classification.variabilityLevel === 'high' ? 'bg-red-400' : 
                    classItem.classification.variabilityLevel === 'medium' ? 'bg-yellow-400' : 
                    'bg-green-400')} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Variability</span>
                      <Badge className={getClassificationBadgeColor(classItem.classification.variabilityLevel)}>
                        {classItem.classification.variabilityLevel}
                      </Badge>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {getClassificationTooltip('variability', classItem.classification.variabilityLevel)}
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {/* Criticality */}
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                  <div className={cn("h-8 w-1 rounded-full", 
                    classItem.classification.criticality === 'high' ? 'bg-red-400' : 
                    classItem.classification.criticality === 'medium' ? 'bg-yellow-400' : 
                    'bg-green-400')} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Criticality</span>
                      <Badge className={getClassificationBadgeColor(classItem.classification.criticality)}>
                        {classItem.classification.criticality}
                      </Badge>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {getClassificationTooltip('criticality', classItem.classification.criticality)}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-4 py-2 bg-white/50 text-xs text-gray-500 text-right">
                Updated: {new Date(classItem.lastUpdated).toLocaleDateString()}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
