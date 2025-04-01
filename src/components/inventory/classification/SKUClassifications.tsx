import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SKUCard } from "./SKUCard";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

export function SKUClassifications() {
  const [classifications, setClassifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadClassifications = async () => {
    setIsLoading(true);
    const data = await fetchInventoryPlanningView();
    setClassifications(data);
    setIsLoading(false);
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

  return (
    <TooltipProvider>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {classifications.map((item, index) => (
          <SKUCard
            key={`${item.product_id}-${item.location_id}`}
            sku={item.product_id}
            classification={{
              leadTimeCategory:
                item.lead_time_days > 30
                  ? "long"
                  : item.lead_time_days > 15
                  ? "medium"
                  : "short",
              variabilityLevel:
                item.demand_variability > 1
                  ? "high"
                  : item.demand_variability > 0.5
                  ? "medium"
                  : "low",
              criticality: item.decoupling_point ? "high" : "low",
              score: item.max_stock_level || 0, // Optional score mapping
            }}
            lastUpdated={new Date().toISOString()}
            index={index}
          />
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
