import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Database, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { 
  generateRealisticHistoricalSales, 
  insertHistoricalSales, 
  clearHistoricalSales,
  getHistoricalSalesSummary 
} from "@/lib/historical-sales-generator.service";
import { supabase } from "@/integrations/supabase/client";

export const SampleDataGenerator = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const summaryData = await getHistoricalSalesSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  const handleGenerateAndInsert = async () => {
    try {
      setGenerating(true);
      toast.info("Generating realistic sales data...");
      
      const salesData = await generateRealisticHistoricalSales(90);
      toast.info(`Generated ${salesData.length} records. Inserting into database...`);
      
      await insertHistoricalSales(salesData);
      toast.success(`Successfully inserted ${salesData.length} historical sales records!`);
      
      await loadSummary();
    } catch (error: any) {
      console.error("Error generating data:", error);
      toast.error(`Failed to generate data: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to delete ALL historical sales data? This cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await clearHistoricalSales();
      toast.success("Historical sales data cleared successfully");
      await loadSummary();
    } catch (error: any) {
      console.error("Error clearing data:", error);
      toast.error(`Failed to clear data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historical_sales_data')
        .select('product_id, location_id, sales_date, quantity_sold, revenue, unit_price')
        .order('sales_date', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) {
        toast.error("No data available to download");
        return;
      }

      const headers = 'product_id,location_id,sales_date,quantity_sold,revenue,unit_price\n';
      const rows = data.map(record => 
        `${record.product_id},${record.location_id},${record.sales_date},${record.quantity_sold},${record.revenue},${record.unit_price}`
      ).join('\n');
      
      const csv = headers + rows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historical_sales_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Data downloaded successfully!");
    } catch (error: any) {
      console.error("Error downloading CSV:", error);
      toast.error(`Failed to download: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Realistic Historical Sales Sample Data
        </CardTitle>
        <CardDescription>
          Download 90 days of realistic historical sales data with proper patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Total Records</div>
                <div className="text-2xl font-bold">{summary.totalRecords.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold">{parseFloat(summary.totalRevenue).toLocaleString()} SAR</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Units</div>
                <div className="text-2xl font-bold">{summary.totalQuantity.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Date Range</div>
                <div className="text-sm font-bold">{summary.dateRange.days} days</div>
                <div className="text-xs text-muted-foreground">{summary.dateRange.start} to {summary.dateRange.end}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8 bg-muted/50 rounded-lg">
            <Database className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No historical sales data found</p>
            <p className="text-xs text-muted-foreground mt-1">Generate realistic data to get started</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Realistic Patterns Included:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✓ Weekend peaks (Friday 30% higher, Saturday 20% higher)</li>
            <li>✓ Seasonal variations (Summer peak, Ramadan dip, Eid surge)</li>
            <li>✓ Location characteristics (Mall locations 50% higher traffic)</li>
            <li>✓ Product popularity (Fries outsell burgers, premium items lower volume)</li>
            <li>✓ Daily random variation (±20% natural fluctuation)</li>
            <li>✓ Regional differences (Makkah 80% higher due to pilgrims)</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button 
            onClick={handleGenerateAndInsert} 
            disabled={generating || loading}
            variant="default"
          >
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Generate 90 Days
              </>
            )}
          </Button>

          <Button 
            onClick={handleDownloadCSV} 
            disabled={loading || !summary}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>

          <Button 
            onClick={handleClearData} 
            disabled={loading || !summary}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
