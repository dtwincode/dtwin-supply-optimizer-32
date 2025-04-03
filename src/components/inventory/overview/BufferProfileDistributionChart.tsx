import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";

const COLORS = ["#EF4444", "#F59E0B", "#10B981"];

export function BufferProfileDistributionChart() {
  const { filters } = useInventoryFilter();
  const [profileData, setProfileData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
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

        const counts: Record<string, number> = {
          BP001: 0,
          BP002: 0,
          BP003: 0,
        };

        filtered.forEach((item: any) => {
          counts[item.buffer_profile_id] += 1;
        });

        setProfileData([
          { name: "Low Variability (BP001)", value: counts.BP001 },
          { name: "Medium Variability (BP002)", value: counts.BP002 },
          { name: "High Variability (BP003)", value: counts.BP003 },
        ]);
      } catch (error) {
        console.error("Error loading buffer profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buffer Profile Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profileData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {profileData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
