
import { useEffect, useState } from "react";
import { Classification } from "@/types/inventory";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SKUCard } from "./classification/SKUCard";
import { supabase } from "@/lib/supabaseClient";

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
      const { data, error } = await supabase
        .from('inventory_planning_view')
        .select('*');
      
      if (error) throw error;
      
      setClassifications(data || []);
    } catch (error) {
      console.error("Error loading classifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClassifications();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading classifications...</div>;
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
        {classifications.length === 0 ? (
          <div className="col-span-full p-6 text-center text-gray-500">
            No classification data available. Check your inventory planning data.
          </div>
        ) : (
          classifications.map((item, index) => {
            // Determine classification categories based on database values
            const leadTimeCategory = item.lead_time_days && item.lead_time_days > 30
              ? "long"
              : item.lead_time_days && item.lead_time_days > 15
              ? "medium"
              : "short";
              
            const variabilityLevel = item.demand_variability && item.demand_variability > 1
              ? "high"
              : item.demand_variability && item.demand_variability > 0.5
              ? "medium"
              : "low";
              
            const criticality = item.decoupling_point ? "high" : "low";
            
            // Create a Classification object from the data
            const classification: Classification = {
              leadTimeCategory,
              variabilityLevel,
              criticality,
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
          })
        )}
      </div>
    </TooltipProvider>
  );
}
