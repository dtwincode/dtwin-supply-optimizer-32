import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Clock, Package } from "lucide-react";

interface ExecutionMetric {
  label: string;
  value: number;
  unit: string;
  icon: any;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
}

export const ExecutionMetrics = () => {
  const [metrics, setMetrics] = useState<ExecutionMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      // Fetch open POs
      const { data: openPOs } = await supabase
        .from("open_pos")
        .select("*")
        .eq("status", "OPEN");

      // Fetch in-transit POs
      const { data: transitPOs } = await supabase
        .from("open_pos")
        .select("*")
        .eq("status", "IN_TRANSIT");

      // Fetch supplier performance
      const { data: suppliers } = await supabase
        .from("supplier_performance")
        .select("on_time_delivery_rate");

      // Fetch late POs
      const { data: latePOs } = await supabase
        .from("open_pos")
        .select("*")
        .lt("expected_date", new Date().toISOString())
        .neq("status", "RECEIVED");

      const avgOnTimeRate = suppliers?.length
        ? (suppliers.reduce((sum, s) => sum + (s.on_time_delivery_rate || 0), 0) / suppliers.length) * 100
        : 0;

      setMetrics([
        {
          label: "Open Purchase Orders",
          value: openPOs?.length || 0,
          unit: "orders",
          icon: Package,
        },
        {
          label: "In Transit",
          value: transitPOs?.length || 0,
          unit: "orders",
          icon: TrendingUp,
        },
        {
          label: "Avg Supplier On-Time Rate",
          value: Math.round(avgOnTimeRate),
          unit: "%",
          icon: Clock,
          trend: avgOnTimeRate >= 90 ? "up" : "down",
        },
        {
          label: "Late Deliveries",
          value: latePOs?.length || 0,
          unit: "orders",
          icon: TrendingDown,
          trend: "down",
        },
      ]);
    } catch (error) {
      console.error("Error loading execution metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading metrics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
