import { motion } from "framer-motion";
import { Award, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassificationItem } from "./ClassificationItem";

interface SKUCardProps {
  sku: string;
  classification: {
    leadTimeCategory: "short" | "medium" | "long";
    variabilityLevel: "low" | "medium" | "high";
    criticality: "low" | "high";
    score: number;
  };
  lastUpdated: string;
  index: number;
}

export function SKUCard({
  sku,
  classification,
  lastUpdated,
  index,
}: SKUCardProps) {
  // Get score color based on value
  const getScoreColor = (score: number | undefined) => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 60) return "text-indigo-600";
    if (score >= 40) return "text-purple-600";
    return "text-gray-600";
  };

  // Different background styles for cards
  const cardBackgrounds = [
    "bg-gradient-to-r from-blue-50 to-indigo-50",
    "bg-gradient-to-r from-purple-50 to-pink-50",
    "bg-gradient-to-r from-green-50 to-emerald-50",
  ];

  // Animation variants
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3, delay: index * 0.1 } },
  };

  return (
    <motion.div variants={item} initial="hidden" animate="show">
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-md",
          cardBackgrounds[index % cardBackgrounds.length]
        )}
      >
        {/* Header with Score */}
        <div className="flex justify-between items-center p-2 border-b">
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-gray-600" />
            <span className="text-xs font-medium">{sku}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-500" />
            <span
              className={cn(
                "text-sm font-bold",
                getScoreColor(classification?.score)
              )}
            >
              {classification?.score || "N/A"}
            </span>
          </div>
        </div>

        {/* Classification Details */}
        <div className="p-2 space-y-1.5">
          <ClassificationItem
            title="Lead Time"
            level={
              classification.leadTimeCategory === "short"
                ? "low"
                : classification.leadTimeCategory === "medium"
                ? "medium"
                : "high"
            }
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
        <div className="px-2 py-1 bg-white/50 text-[10px] text-gray-500 text-right">
          {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "N/A"}
        </div>
      </Card>
    </motion.div>
  );
}
