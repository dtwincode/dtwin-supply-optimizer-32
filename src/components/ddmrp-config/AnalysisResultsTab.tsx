import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DemandAnalysis {
  product_id: string;
  location_id: string;
  mean_demand: number;
  std_dev_demand: number;
  cv: number | null;
  variability_score: number;
  analysis_period_start: string;
  analysis_period_end: string;
}

interface UsageAnalysis {
  product_id: string;
  location_id: string;
  avg_weekly_usage: number;
  percentage_of_total_usage: number;
  volume_score: number;
}

export function AnalysisResultsTab() {
  const [demandAnalysis, setDemandAnalysis] = useState<DemandAnalysis[]>([]);
  const [usageAnalysis, setUsageAnalysis] = useState<UsageAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [demandRes, usageRes] = await Promise.all([
        supabase
          .from('demand_history_analysis')
          .select('*')
          .order('variability_score', { ascending: false })
          .limit(20),
        supabase
          .from('usage_analysis')
          .select('*')
          .order('volume_score', { ascending: false })
          .limit(20)
      ]);

      if (demandRes.error) throw demandRes.error;
      if (usageRes.error) throw usageRes.error;

      setDemandAnalysis(demandRes.data || []);
      setUsageAnalysis(usageRes.data || []);
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      toast({
        title: "Error",
        description: "Failed to load analysis results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getVariabilityBadge = (cv: number) => {
    if (cv < 0.2) return { variant: "secondary" as const, label: "Low" };
    if (cv < 0.5) return { variant: "default" as const, label: "Medium" };
    return { variant: "destructive" as const, label: "High" };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              Statistical demand analysis and usage pattern insights
            </CardDescription>
          </div>
          <Button onClick={fetchData} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demand">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demand">
              <TrendingUp className="h-4 w-4 mr-2" />
              Demand Analysis
            </TabsTrigger>
            <TabsTrigger value="usage">
              <BarChart3 className="h-4 w-4 mr-2" />
              Usage Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demand">
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Mean Demand</TableHead>
                    <TableHead className="text-right">Std Dev</TableHead>
                    <TableHead className="text-right">CV</TableHead>
                    <TableHead>Variability</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : demandAnalysis.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No demand analysis data available. Run analysis to populate.
                      </TableCell>
                    </TableRow>
                  ) : (
                    demandAnalysis.map((item, idx) => {
                      const badge = getVariabilityBadge(item.cv || 0);
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.product_id}</TableCell>
                          <TableCell>{item.location_id}</TableCell>
                          <TableCell className="text-right">{item.mean_demand.toFixed(1)}</TableCell>
                          <TableCell className="text-right">{item.std_dev_demand.toFixed(1)}</TableCell>
                          <TableCell className="text-right">{(item.cv || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={badge.variant}>{item.variability_score}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Avg Weekly Usage</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead className="text-right">Volume Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : usageAnalysis.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No usage analysis data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    usageAnalysis.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.product_id}</TableCell>
                        <TableCell>{item.location_id}</TableCell>
                        <TableCell className="text-right">{item.avg_weekly_usage.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{item.percentage_of_total_usage.toFixed(2)}%</TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={
                              item.volume_score >= 80 ? "default" : 
                              item.volume_score >= 50 ? "secondary" : "destructive"
                            }
                          >
                            {item.volume_score}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
