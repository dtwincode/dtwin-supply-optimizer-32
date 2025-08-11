
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ClassificationData {
  leadTimeCategory: "short" | "medium" | "long";
  variabilityLevel: "low" | "medium" | "high";
  criticality: "low" | "medium" | "high";
  bufferProfile: string;
  score: number;
}

interface SKUCardProps {
  sku: string;
  classification: ClassificationData;
  lastUpdated: string;
  index: number;
}

export const SKUCard: React.FC<SKUCardProps> = ({ sku, classification, lastUpdated, index }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const getCategoryColor = (category: string, level: string): string => {
    if (category === "leadTimeCategory") {
      return level === "short" 
        ? "bg-green-100 text-green-800" 
        : level === "medium" 
          ? "bg-yellow-100 text-yellow-800" 
          : "bg-red-100 text-red-800";
    }
    
    if (category === "variabilityLevel") {
      return level === "low" 
        ? "bg-blue-100 text-blue-800" 
        : level === "medium" 
          ? "bg-purple-100 text-purple-800" 
          : "bg-orange-100 text-orange-800";
    }
    
    if (category === "criticality") {
      return level === "low" 
        ? "bg-gray-100 text-gray-800" 
        : level === "medium" 
          ? "bg-indigo-100 text-indigo-800" 
          : "bg-pink-100 text-pink-800";
    }

    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <motion.div variants={item}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{sku}</h3>
              <p className="text-xs text-muted-foreground">
                Updated: {formatDate(lastUpdated)}
              </p>
            </div>
            <Badge variant="outline">{classification.bufferProfile}</Badge>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Lead Time:</span>
              <Badge className={getCategoryColor("leadTimeCategory", classification.leadTimeCategory)}>
                {classification.leadTimeCategory}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Variability:</span>
              <Badge className={getCategoryColor("variabilityLevel", classification.variabilityLevel)}>
                {classification.variabilityLevel}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Criticality:</span>
              <Badge className={getCategoryColor("criticality", classification.criticality)}>
                {classification.criticality}
              </Badge>
            </div>

            <div className="flex justify-between items-center pt-2 border-t mt-3">
              <span className="text-sm font-medium">Score:</span>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <span className="font-semibold">{classification.score}</span>
                    <InfoCircledIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Combined classification score based on lead time, variability, and criticality</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
