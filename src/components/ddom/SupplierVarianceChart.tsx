import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SupplierData {
  supplier_id: string;
  on_time_delivery_rate: number | null;
  quality_score: number | null;
  reliability_score: number | null;
}

export const SupplierVarianceChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSupplierData();
  }, []);

  const loadSupplierData = async () => {
    try {
      const { data: suppliers, error } = await supabase
        .from("supplier_performance")
        .select("*")
        .order("on_time_delivery_rate", { ascending: false })
        .limit(10);

      if (error) throw error;

      const chartData = (suppliers || []).map((s: SupplierData) => ({
        supplier: s.supplier_id.substring(0, 8),
        "On-Time Rate": Math.round((s.on_time_delivery_rate || 0) * 100),
        "Quality Score": Math.round((s.quality_score || 0) * 100),
        "Reliability": Math.round((s.reliability_score || 0) * 100),
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error loading supplier data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground">Loading supplier performance...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Performance Variance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="supplier" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="On-Time Rate" fill="hsl(var(--primary))" />
            <Bar dataKey="Quality Score" fill="hsl(var(--secondary))" />
            <Bar dataKey="Reliability" fill="hsl(var(--accent))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
