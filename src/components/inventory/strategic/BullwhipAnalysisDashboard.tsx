import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, TrendingUp, Activity, ChevronDown, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

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
    <TooltipProvider>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Items with bullwhip ratio ≥ 2.0 require immediate attention</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalItems.length}</div>
              <p className="text-xs text-muted-foreground">
                High amplification (ratio ≥ 2.0)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">Avg Bullwhip Ratio</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Order variability / Demand variability. Lower is better.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRatio}</div>
              <p className="text-xs text-muted-foreground">
                Target: &lt; 1.5 (stable demand)
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
            <AlertTitle>High Amplification Detected</AlertTitle>
            <AlertDescription>
              {criticalItems.length} product-location pairs show severe demand amplification (ratio ≥ 2.0). 
              These items are strong candidates for strategic decoupling points to break the bullwhip effect.
            </AlertDescription>
          </Alert>
        )}

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bullwhip Analysis Details</CardTitle>
            <CardDescription>
              Demand amplification metrics for each product-location pair
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

        {/* Collapsible Explanation */}
        <Card>
          <CardHeader>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between p-0 hover:bg-transparent">
                  <CardTitle className="text-base">What is the Bullwhip Effect?</CardTitle>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Definition</h4>
                  <p className="text-sm text-muted-foreground">
                    The bullwhip effect occurs when small fluctuations in retail demand cause
                    progressively larger swings in orders upstream. A 5% variance in consumer
                    demand can result in 40-50% variance in manufacturer orders.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Calculation</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Bullwhip Ratio = Order CV / Demand CV</strong>
                    <br />
                    CV (Coefficient of Variation) = Standard Deviation / Mean
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">DDMRP Mitigation</h4>
                  <p className="text-sm text-muted-foreground">
                    Strategic decoupling points absorb demand variability and prevent cascading
                    upstream, reducing the bullwhip effect by 30-50% (Ptak & Smith, 2016).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Scoring Weight</h4>
                  <p className="text-sm text-muted-foreground">
                    Bullwhip contributes 15% to the 9-factor weighted score. Items with ratio ≥ 2.0
                    receive maximum bullwhip score.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardHeader>
        </Card>
      </div>
    </TooltipProvider>
  );
}
