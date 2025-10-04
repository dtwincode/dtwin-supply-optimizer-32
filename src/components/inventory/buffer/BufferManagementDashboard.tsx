
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";

interface BufferItem {
  product_id: string;
  location_id: string;
  min_stock_level: number;
  max_stock_level: number;
  buffer_profile_id: string;
}

export function BufferManagementDashboard() {
  const { filters } = useInventoryFilter();
  const [buffers, setBuffers] = useState<BufferItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBuffers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();

      const filtered = data.filter((item: any) => {
        if (filters.productId && item.product_id !== filters.productId) return false;
        if (filters.locationId && item.location_id !== filters.locationId) return false;
        if (filters.channelId && item.channel_id !== filters.channelId) return false;
        if (filters.decouplingOnly && !item.decoupling_point) return false;
        return true;
      });

      // Transform data to match BufferItem interface
      const transformedData: BufferItem[] = filtered.map((item: any) => ({
        product_id: item.sku || item.product_id,
        location_id: item.location_id,
        min_stock_level: item.min_stock_level,
        max_stock_level: item.max_stock_level,
        buffer_profile_id: item.buffer_profile_id || 'Default'
      }));

      setBuffers(transformedData);
    } catch (error) {
      console.error("Error loading buffer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBuffers();
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
    return <div className="p-6">Loading buffer data...</div>;
  }

  return (
    <TooltipProvider>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {buffers.map((item, index) => (
          <Card key={`${item.product_id}-${item.location_id}`} className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{item.product_id}</h4>
              <p>Location: {item.location_id}</p>
              <p>Min Stock: {item.min_stock_level}</p>
              <p>Max Stock: {item.max_stock_level}</p>
              <p>Profile: {item.buffer_profile_id}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
