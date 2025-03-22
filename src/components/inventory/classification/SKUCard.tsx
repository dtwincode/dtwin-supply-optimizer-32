
import { motion } from "framer-motion";
import { Award, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassificationItem } from "./ClassificationItem";
import { Classification } from "@/types/inventory/classificationTypes";

interface SKUCardProps {
  sku: string;
  classification: Classification;
  lastUpdated: string;
  index: number;
}

export function SKUCard({ sku, classification, lastUpdated, index }: SKUCardProps) {
  // Get score color based on value
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

  // Animation variants
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3, delay: index * 0.1 } }
  };

  return (
    <motion.div variants={item} initial="hidden" animate="show">
      <Card className={cn("overflow-hidden transition-all hover:shadow-lg", cardBackgrounds[index % cardBackgrounds.length])}>
        {/* Header with Score */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-white shadow-sm">
              <Tag className="w-4 h-4 text-gray-600" />
            </div>
            <span className="font-medium">{sku}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500">Score</span>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className={cn("text-lg font-bold", getScoreColor(classification.score || 0))}>
                {classification.score || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Classification Details */}
        <div className="p-4 space-y-3">
          <ClassificationItem 
            title="Lead Time"
            level={mapLeadTimeCategoryToLevel(classification.leadTimeCategory)}
            type="leadTime"
          />
          
          <ClassificationItem 
            title="Variability"
            level={classification.variabilityLevel}
            type="variability"
          />
          
          <ClassificationItem 
            title="Criticality"
            level={classification.criticality}
            type="criticality"
          />
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 bg-white/50 text-xs text-gray-500 text-right">
          Updated: {new Date(lastUpdated).toLocaleDateString()}
        </div>
      </Card>
    </motion.div>
  );
}
