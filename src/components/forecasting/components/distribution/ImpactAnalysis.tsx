
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface ImpactAnalysisProps {
  onReconciliationComplete: () => void;
}

export const ImpactAnalysis = ({ onReconciliationComplete }: ImpactAnalysisProps) => {
  const { toast } = useToast();
  const [reconciliationMethod, setReconciliationMethod] = useState<"top-down" | "bottom-up">("top-down");
  const [selectedLevel, setSelectedLevel] = useState<string>("product");
  const [isReconciling, setIsReconciling] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState<string>("7");
  const [periodUnit, setPeriodUnit] = useState<string>("days");

  const hierarchyLevels = [
    { value: "product", label: "Product Level" },
    { value: "category", label: "Category Level" },
    { value: "region", label: "Regional Level" },
    { value: "total", label: "Total Level" },
  ];

  const periodOptions = [
    { value: "7", label: "7 days" },
    { value: "14", label: "14 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "180", label: "180 days" },
    { value: "365", label: "365 days" },
  ];

  const mockData = [
    { level: "SKU001", forecast: 100, actual: 95, difference: -5 },
    { level: "SKU002", forecast: 150, actual: 160, difference: 10 },
    { level: "SKU003", forecast: 80, actual: 75, difference: -5 },
  ];

  const reconciliationData = [
    { name: 'Week 1', before: 120, after: 115, target: 118 },
    { name: 'Week 2', before: 150, after: 145, target: 148 },
    { name: 'Week 3', before: 180, after: 175, target: 178 },
    { name: 'Week 4', before: 135, after: 132, target: 130 },
    { name: 'Week 5', before: 160, after: 158, target: 155 },
  ];

  const handleReconciliation = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      toast({
        title: "Reconciliation Complete",
        description: `Distribution quantities have been reconciled for the next ${forecastPeriod} ${periodUnit}`
      });
      onReconciliationComplete();
    }, 1500);
  };

  return (
    <Card className="p-6 shadow-sm">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Distribution Impact Analysis</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-4">Forecast Configuration</h4>
            <div className="space-y-4">
              {/* Forecast Period Selector */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Forecast Timeline</label>
                <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Reconciliation Method</label>
                <Select
                  value={reconciliationMethod}
                  onValueChange={(value: "top-down" | "bottom-up") => setReconciliationMethod(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-down">Top-Down</SelectItem>
                    <SelectItem value="bottom-up">Bottom-Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Hierarchy Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {hierarchyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleReconciliation}
                disabled={isReconciling}
                className="w-[200px] mt-4"
              >
                {isReconciling ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Reconciling...
                  </>
                ) : (
                  "Run Reconciliation"
                )}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Impact Summary</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Forecast</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((row) => (
                  <TableRow key={row.level}>
                    <TableCell>{row.level}</TableCell>
                    <TableCell className="text-right">{row.forecast}</TableCell>
                    <TableCell className="text-right">{row.actual}</TableCell>
                    <TableCell className="text-right">
                      <span className={row.difference > 0 ? "text-green-600" : "text-red-600"}>
                        {row.difference > 0 ? "+" : ""}{row.difference}
                        {row.difference > 0 ? (
                          <ArrowUp className="inline ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline ml-1 h-4 w-4" />
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Reconciliation Chart */}
        <div className="mt-6">
          <h4 className="font-medium mb-4">Reconciliation Comparison</h4>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reconciliationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="before" 
                  stroke="#8884d8" 
                  name="Before Reconciliation"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="after" 
                  stroke="#82ca9d" 
                  name="After Reconciliation"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ffc658" 
                  name="Target"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
