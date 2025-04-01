
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SKUCard } from "./SKUCard";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { Classification } from "@/types/inventory/classificationTypes";

interface SKUClassificationItem {
  product_id: string;
  location_id: string;
  lead_time_days?: number;
  demand_variability?: number;
  decoupling_point?: boolean;
  max_stock_level?: number;
}

export function SKUClassifications() {
  const [classifications, setClassifications] = useState<SKUClassificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadClassifications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();
      // Type assertion to match the expected type
      setClassifications(data as unknown as SKUClassificationItem[]);
    } catch (error) {
      console.error("Error loading classifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClassifications();
  }, []);

  // Animation variants for container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return <div className="p-6">Loading classifications...</div>;
  }

  return (
    <TooltipProvider>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {classifications.map((item, index) => {
          // Create a Classification object from the data
          const classification: Classification = {
            leadTimeCategory:
              item.lead_time_days && item.lead_time_days > 30
                ? "long"
                : item.lead_time_days && item.lead_time_days > 15
                ? "medium"
                : "short",
            variabilityLevel:
              item.demand_variability && item.demand_variability > 1
                ? "high"
                : item.demand_variability && item.demand_variability > 0.5
                ? "medium"
                : "low",
            criticality: item.decoupling_point ? "high" : "low",
            score: item.max_stock_level || 0,
          };

          return (
            <SKUCard
              key={`${item.product_id}-${item.location_id}`}
              sku={item.product_id}
              classification={classification}
              lastUpdated={new Date().toISOString()}
              index={index}
            />
          );
        })}
      </motion.div>
    </TooltipProvider>
  );
}
