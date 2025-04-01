
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Classification } from "@/types/inventory/classificationTypes";
import { formatDistanceToNow } from "date-fns";

interface SKUCardProps {
  sku: string;
  classification: Classification;
  lastUpdated: string;
  index: number;
}

export function SKUCard({ 
  sku, 
  classification, 
  lastUpdated,
  index
}: SKUCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Item animation
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.05
      }
    }
  };

  const getLeadTimeColor = (category: string) => {
    switch (category) {
      case 'short':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'long':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVariabilityColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassificationScore = () => {
    const score = classification?.score || 0;
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <motion.div variants={item}>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowDetails(!showDetails)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{sku}</CardTitle>
          <CardDescription className="text-xs">
            {lastUpdated ? `Updated ${formatDistanceToNow(new Date(lastUpdated))} ago` : 'No update time available'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 space-y-3">
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Lead Time:</span>
                  <Badge className={getLeadTimeColor(classification?.leadTimeCategory || 'short')}>
                    {classification?.leadTimeCategory || 'Unknown'}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Lead time category based on average lead time days</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Variability:</span>
                  <Badge className={getVariabilityColor(classification?.variabilityLevel || 'low')}>
                    {classification?.variabilityLevel || 'Unknown'}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Demand variability categorized as low, medium, or high</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Criticality:</span>
                  <Badge className={getCriticalityColor(classification?.criticality || 'low')}>
                    {classification?.criticality || 'Unknown'}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Product criticality based on business impact</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full flex justify-between items-center">
            <span className="text-xs text-gray-500">Score:</span>
            <Badge className={getClassificationScore()}>
              {classification?.score !== undefined ? classification.score : 'N/A'}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
