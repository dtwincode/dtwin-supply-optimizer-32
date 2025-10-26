import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BullwhipData {
  product_id: string;
  location_id: string;
  bullwhip_ratio: number;
  customer_demand_cv: number;
  order_qty_cv: number;
  bullwhip_score: number;
  analysis_period_start: string;
  analysis_period_end: string;
}

export function BullwhipAnalysisDashboard() {
  const [data, setData] = useState<BullwhipData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBullwhipData();
  }, []);

  const loadBullwhipData = async () => {
    setLoading(true);
    try {
      // Direct query to the new table
      const { data: rawData, error } = await supabase
        .from("bullwhip_analysis" as any)
        .select("*")
        .order("bullwhip_ratio", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error loading bullwhip data:", error);
        setData([]);
        return;
      }

      // Type assertion for the data (types will be regenerated after migration)
      const bullwhipData = (rawData as unknown) as BullwhipData[];
      setData(bullwhipData || []);
    } catch (error) {
      console.error("Error loading bullwhip data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (ratio: number) => {
    if (ratio >= 3.0) return <Badge variant="destructive">CRITICAL</Badge>;
    if (ratio >= 2.0) return <Badge className="bg-orange-500">HIGH</Badge>;
    if (ratio >= 1.5) return <Badge className="bg-yellow-500">MODERATE</Badge>;
    if (ratio >= 1.2) return <Badge variant="secondary">MILD</Badge>;
    return <Badge variant="outline">LOW</Badge>;
  };

  const getInterpretation = (ratio: number): string => {
    if (ratio >= 3.0) return "Severe demand amplification - immediate decoupling required";
    if (ratio >= 2.0) return "Significant amplification - strong decoupling candidate";
    if (ratio >= 1.5) return "Noticeable amplification - consider decoupling";
    if (ratio >= 1.2) return "Minor amplification - monitor closely";
    if (ratio >= 1.0) return "Minimal amplification - low priority";
    return "No amplification detected";
  };

  const criticalItems = data.filter(d => d.bullwhip_ratio >= 2.0);
  const avgRatio = data.length > 0 
    ? (data.reduce((sum, d) => sum + d.bullwhip_ratio, 0) / data.length).toFixed(2)
    : "0.00";

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading bullwhip analysis...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Bullwhip ratio ≥ 2.0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRatio}</div>
            <p className="text-xs text-muted-foreground">
              Across all analyzed items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Analyzed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              Product-location pairs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for Critical Items */}
      {criticalItems.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Bullwhip Effect Detected</AlertTitle>
          <AlertDescription>
            {criticalItems.length} item(s) showing severe demand amplification (ratio ≥ 2.0). 
            These should be prioritized for decoupling point designation to absorb variability.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bullwhip Effect Analysis</CardTitle>
          <CardDescription>
            Demand amplification ratio = Order Variability / Customer Demand Variability. 
            Ratios &gt; 1.0 indicate upstream amplification (the bullwhip effect).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bullwhip analysis data available. Run the analysis to populate this dashboard.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Bullwhip Ratio</TableHead>
                    <TableHead className="text-right">Demand CV</TableHead>
                    <TableHead className="text-right">Order CV</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Interpretation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={`${item.product_id}-${item.location_id}`}>
                      <TableCell className="font-mono text-sm">{item.product_id}</TableCell>
                      <TableCell>{item.location_id}</TableCell>
                      <TableCell className="text-right font-bold">
                        {item.bullwhip_ratio.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{item.customer_demand_cv.toFixed(3)}</TableCell>
                      <TableCell className="text-right">{item.order_qty_cv.toFixed(3)}</TableCell>
                      <TableCell className="text-right">{item.bullwhip_score}</TableCell>
                      <TableCell>{getSeverityBadge(item.bullwhip_ratio)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getInterpretation(item.bullwhip_ratio)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explanation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding the Bullwhip Effect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The <strong>Bullwhip Effect</strong> is a critical supply chain phenomenon where small fluctuations 
            in downstream customer demand cause progressively larger fluctuations in upstream order quantities. 
            This is a primary reason for placing strategic decoupling points in DDMRP.
          </p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">How It Works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Ratio = 1.0:</strong> No amplification (order variability = demand variability)</li>
              <li><strong>Ratio = 1.5:</strong> Orders are 50% more variable than customer demand</li>
              <li><strong>Ratio = 2.0:</strong> Orders are twice as variable as customer demand (CRITICAL)</li>
              <li><strong>Ratio = 3.0+:</strong> Severe amplification requiring immediate action</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">DDMRP Solution:</h4>
            <p className="text-sm text-muted-foreground">
              Strategic decoupling points <strong>absorb variability</strong> by maintaining buffer inventory. 
              This breaks the demand signal chain and prevents upstream amplification, reducing costs and 
              improving service levels across the supply chain.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
