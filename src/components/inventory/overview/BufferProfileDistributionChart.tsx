
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const COLORS = ["#EF4444", "#F59E0B", "#10B981"];

export function BufferProfileDistributionChart() {
  const { filters } = useInventoryFilter();
  const [profileData, setProfileData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

      const counts: Record<string, { name: string; count: number }> = {};

      filtered.forEach((item: any) => {
        if (item.buffer_profile_id) {
          const profileId = item.buffer_profile_id;
          if (!counts[profileId]) {
            counts[profileId] = {
              name: item.buffer_profile_name || profileId,
              count: 0
            };
          }
          counts[profileId].count++;
        }
      });

      const chartData = Object.values(counts).map(profile => ({
        name: profile.name,
        value: profile.count
      }));

      console.log('Buffer Profile Chart Data:', chartData);
      setProfileData(chartData);
      
      toast.success("Chart data refreshed");
    } catch (error) {
      console.error("Error loading buffer profile data:", error);
      toast.error("Failed to refresh chart data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [filters]);

  const handleRefresh = () => {
    loadProfileData();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Buffer Profile Distribution</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="p-4 text-center">Loading...</p>
        ) : profileData.length === 0 ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-muted-foreground">No buffer profile data available</p>
          </div>
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
                  label={(entry) => `${entry.name} (${entry.value})`}
                  fill="#8884d8"
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
