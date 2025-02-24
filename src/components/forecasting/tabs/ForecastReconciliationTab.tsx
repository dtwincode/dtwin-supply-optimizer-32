
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ForecastDataPoint } from "@/types/forecasting";

interface ReconciliationLevel {
  level: string;
  forecast: number;
  actual: number;
  difference: number;
}

const ForecastReconciliationTab = () => {
  const [reconciliationMethod, setReconciliationMethod] = useState<"top-down" | "bottom-up">("top-down");
  const [selectedLevel, setSelectedLevel] = useState<string>("product");
  const [isReconciling, setIsReconciling] = useState(false);

  const hierarchyLevels = [
    { value: "product", label: "Product Level" },
    { value: "category", label: "Category Level" },
    { value: "region", label: "Regional Level" },
    { value: "total", label: "Total Level" },
  ];

  const mockData: ReconciliationLevel[] = [
    { level: "SKU001", forecast: 100, actual: 95, difference: -5 },
    { level: "SKU002", forecast: 150, actual: 160, difference: 10 },
    { level: "SKU003", forecast: 80, actual: 75, difference: -5 },
  ];

  const handleReconciliation = () => {
    setIsReconciling(true);
    // Simulating reconciliation process
    setTimeout(() => {
      setIsReconciling(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Forecast Reconciliation</h2>
          <p className="text-sm text-muted-foreground">
            Reconcile forecasts across different hierarchical levels
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Reconciliation Settings</h3>
              <Button
                variant="outline"
                size="sm"
                disabled={isReconciling}
                onClick={handleReconciliation}
                className="gap-2"
              >
                {isReconciling ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Reconcile Forecasts
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reconciliation Method</label>
                <div className="flex gap-2">
                  <Button
                    variant={reconciliationMethod === "top-down" ? "default" : "outline"}
                    onClick={() => setReconciliationMethod("top-down")}
                    className="flex-1 gap-2"
                  >
                    <ArrowDown className="h-4 w-4" />
                    Top-Down
                  </Button>
                  <Button
                    variant={reconciliationMethod === "bottom-up" ? "default" : "outline"}
                    onClick={() => setReconciliationMethod("bottom-up")}
                    className="flex-1 gap-2"
                  >
                    <ArrowUp className="h-4 w-4" />
                    Bottom-Up
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hierarchy Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
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
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium">Discrepancy Alerts</h4>
              <div className="space-y-2">
                {mockData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted"
                  >
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        Math.abs(item.difference) > 8 ? "text-red-500" : "text-yellow-500"
                      }`}
                    />
                    <span className="flex-1">
                      {item.level}: {Math.abs(item.difference)}% {item.difference > 0 ? "above" : "below"}{" "}
                      expected
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reconciliation Impact</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#8884d8"
                    name="Original Forecast"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#82ca9d"
                    name="Reconciled Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForecastReconciliationTab;
