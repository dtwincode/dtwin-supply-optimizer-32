
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
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";

interface ImpactAnalysisProps {
  onReconciliationComplete: () => void;
  forecastPeriod: string;
}

export const ImpactAnalysis = ({ onReconciliationComplete, forecastPeriod }: ImpactAnalysisProps) => {
  const { toast } = useToast();
  const { t } = useI18n();
  const [reconciliationMethod, setReconciliationMethod] = useState<"top-down" | "bottom-up">("top-down");
  const [selectedLevel, setSelectedLevel] = useState<string>("product");
  const [isReconciling, setIsReconciling] = useState(false);

  const hierarchyLevels = [
    { value: "product", label: "Product Level" },
    { value: "category", label: "Category Level" },
    { value: "region", label: "Regional Level" },
    { value: "total", label: "Total Level" },
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
        title: t("forecasting.reconciliationComplete") || "Reconciliation Complete",
        description: t("forecasting.distributionReconciled", { days: forecastPeriod }) || 
                    `Distribution quantities have been reconciled for the next ${forecastPeriod} days`
      });
      onReconciliationComplete();
    }, 1500);
  };

  return (
    <Card className="p-6 shadow-sm">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">{t("forecasting.distributionImpactAnalysis") || "Distribution Impact Analysis"}</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-4">{t("forecasting.reconciliationConfig") || "Reconciliation Configuration"}</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t("forecasting.reconciliationMethod") || "Reconciliation Method"}</label>
                <Select
                  value={reconciliationMethod}
                  onValueChange={(value: "top-down" | "bottom-up") => setReconciliationMethod(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t("forecasting.selectMethod") || "Select method"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-down">{t("forecasting.topDown") || "Top-Down"}</SelectItem>
                    <SelectItem value="bottom-up">{t("forecasting.bottomUp") || "Bottom-Up"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t("forecasting.hierarchyLevel") || "Hierarchy Level"}</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t("forecasting.selectLevel") || "Select level"} />
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
                    {t("forecasting.reconciling") || "Reconciling..."}
                  </>
                ) : (
                  t("forecasting.runReconciliation") || "Run Reconciliation"
                )}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">{t("forecasting.impactSummary") || "Impact Summary"}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("forecasting.level") || "Level"}</TableHead>
                  <TableHead className="text-right">{t("forecasting.forecast") || "Forecast"}</TableHead>
                  <TableHead className="text-right">{t("forecasting.actual") || "Actual"}</TableHead>
                  <TableHead className="text-right">{t("forecasting.difference") || "Difference"}</TableHead>
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

        <div className="mt-6">
          <h4 className="font-medium mb-4">{t("forecasting.reconciliationComparison") || "Reconciliation Comparison"}</h4>
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
                  name={t("forecasting.beforeReconciliation") || "Before Reconciliation"}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="after" 
                  stroke="#82ca9d" 
                  name={t("forecasting.afterReconciliation") || "After Reconciliation"}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ffc658" 
                  name={t("forecasting.target") || "Target"}
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
