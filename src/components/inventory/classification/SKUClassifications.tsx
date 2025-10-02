
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SKUCard } from "./SKUCard";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import * as FileSaver from "file-saver";
import { useInventoryConfig } from "@/hooks/useInventoryConfig";

export function SKUClassifications() {
  const { getConfig } = useInventoryConfig();
  const [classifications, setClassifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadClassifications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();
      setClassifications(data as any[]);
    } catch (error) {
      console.error("Error loading classifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClassifications();
  }, []);

  const exportToCSV = () => {
    const csvContent =
      "Product ID,Location ID,Lead Time,Demand Variability,Decoupling Point,Buffer Profile\n" +
      classifications
        .map((item) =>
          [
            item.product_id,
            item.location_id,
            item.lead_time_days,
            item.demand_variability,
            item.decoupling_point ? "Yes" : "No",
            item.buffer_profile_id,
          ].join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    FileSaver.saveAs(blob, "sku_classifications.csv");
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">SKU Classification</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadClassifications} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="secondary" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6">Loading classifications...</div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {classifications.map((item, index) => {
            const longThreshold = getConfig('lead_time_long_threshold', 30);
            const mediumThreshold = getConfig('lead_time_medium_threshold', 15);
            const highVarThreshold = getConfig('demand_variability_high_threshold', 0.6);
            const mediumVarThreshold = getConfig('demand_variability_medium_threshold', 0.3);
            
            return (
              <SKUCard
                key={`${item.product_id}-${item.location_id}`}
                sku={item.product_id}
                classification={{
                  leadTimeCategory:
                    item.lead_time_days > longThreshold
                      ? "long"
                      : item.lead_time_days > mediumThreshold
                      ? "medium"
                      : "short",
                  variabilityLevel:
                    item.demand_variability > highVarThreshold
                      ? "high"
                      : item.demand_variability > mediumVarThreshold
                      ? "medium"
                      : "low",
                  criticality: item.decoupling_point ? "high" : "low",
                  bufferProfile: item.buffer_profile_id,
                  score: item.max_stock_level || 0,
                }}
                lastUpdated={new Date().toISOString()}
                index={index}
              />
            );
          })}
        </motion.div>
      )}
    </TooltipProvider>
  );
}
