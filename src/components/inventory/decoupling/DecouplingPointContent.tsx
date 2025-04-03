
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";

interface DecouplingItem {
  product_id: string;
  location_id: string;
  decoupling_point: boolean;
  lead_time_days: number;
}

export function DecouplingPointContent() {
  const { filters } = useInventoryFilter();
  const [decouplingData, setDecouplingData] = useState<DecouplingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDecoupling = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();

      const filtered = data.filter((item: any) => {
        if (filters.productCategory && item.category !== filters.productCategory) return false;
        if (filters.locationId && item.location_id !== filters.locationId) return false;
        if (filters.channelId && item.channel_id !== filters.channelId) return false;
        if (filters.decouplingOnly && !item.decoupling_point) return false;
        return true;
      });

      // Transform data to match DecouplingItem interface
      const transformedData: DecouplingItem[] = filtered.map((item: any) => ({
        product_id: item.sku || item.product_id,
        location_id: item.location_id,
        decoupling_point: Boolean(item.decoupling_point),
        lead_time_days: item.lead_time_days || 0
      }));

      setDecouplingData(transformedData);
    } catch (error) {
      console.error("Error loading decoupling data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecoupling();
  }, [filters]);

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
    return <div className="p-6">Loading decoupling points...</div>;
  }

  return (
    <TooltipProvider>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {decouplingData.map((item, index) => (
          <Card key={`${item.product_id}-${item.location_id}`} className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{item.product_id}</h4>
              <p>Location: {item.location_id}</p>
              <p>Lead Time: {item.lead_time_days} days</p>
              <p>Decoupling Point: {item.decoupling_point ? "Yes" : "No"}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
