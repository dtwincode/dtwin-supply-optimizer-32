
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, AlertTriangle, Check, BarChart2 } from "lucide-react";
import { Classification } from "@/types/inventory";

interface SKUCardProps {
  sku: string;
  classification: Classification;
  lastUpdated: string;
  index: number;
}

export function SKUCard({ sku, classification, lastUpdated, index }: SKUCardProps) {
  const item = {
    // Animation variants for staggered appearance
    variants: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    }
  };

  // Color mapping for different categories
  const getLeadTimeColor = (category: string) => {
    switch (category) {
      case "short": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "long": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVariabilityColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      variants={item.variants}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{sku}</h3>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(lastUpdated).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Score: {classification.score}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-1 mt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Lead Time</span>
                    </div>
                    <Badge className={`text-xs ${getLeadTimeColor(classification.leadTimeCategory)}`}>
                      {classification.leadTimeCategory}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">Lead time category</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BarChart2 className="h-3 w-3" />
                      <span>Variability</span>
                    </div>
                    <Badge className={`text-xs ${getVariabilityColor(classification.variabilityLevel)}`}>
                      {classification.variabilityLevel}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">Demand variability level</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Criticality</span>
                    </div>
                    <Badge className={`text-xs ${getCriticalityColor(classification.criticality)}`}>
                      {classification.criticality}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">Item criticality</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
