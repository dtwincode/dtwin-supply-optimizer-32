import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Database } from "lucide-react";
import { generateCSV, getSalesSummary } from "@/data/realisticHistoricalSales";
import { toast } from "sonner";

export const SampleDataGenerator = () => {
  const summary = getSalesSummary();

  const handleDownloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historical_sales_90days_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Sample data downloaded successfully!");
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
            <div className="text-sm text-muted-foreground">Avg Daily</div>
            <div className="text-2xl font-bold">{summary.avgDailyQuantity.toLocaleString()}</div>
          </div>
        </div>

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

        <Button onClick={handleDownloadCSV} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Sample Historical Sales CSV
        </Button>
      </CardContent>
    </Card>
  );
};
