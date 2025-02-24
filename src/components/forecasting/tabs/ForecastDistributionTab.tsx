import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Save,
  X
} from "lucide-react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface DistributionData {
  id: string;
  sku: string;
  category: string;
  currentStock: number;
  minQuantity: number;
  optimalQuantity: number;
  maxQuantity: number;
  leadTime: number;
  safetyStock: number;
  forecastAccuracy: number;
  serviceLevel: number;
  lastUpdated: string;
}

interface EditableCell {
  rowId: string;
  field: 'minQuantity' | 'optimalQuantity' | 'maxQuantity' | 'safetyStock' | 'serviceLevel';
  value: number;
}

export const ForecastDistributionTab = ({ forecastTableData }: { forecastTableData: any[] }) => {
  const { toast } = useToast();
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const [distributionData, setDistributionData] = useState<DistributionData[]>([
    {
      id: "1",
      sku: "SKU001",
      category: "Electronics",
      currentStock: 120,
      minQuantity: 100,
      optimalQuantity: 150,
      maxQuantity: 200,
      leadTime: 14,
      safetyStock: 50,
      forecastAccuracy: 85,
      serviceLevel: 95,
      lastUpdated: "2024-03-25"
    },
    {
      id: "2",
      sku: "SKU002",
      category: "Appliances",
      currentStock: 60,
      minQuantity: 50,
      optimalQuantity: 75,
      maxQuantity: 100,
      leadTime: 21,
      safetyStock: 25,
      forecastAccuracy: 78,
      serviceLevel: 92,
      lastUpdated: "2024-03-25"
    },
    {
      id: "3",
      sku: "SKU003",
      category: "Furniture",
      currentStock: 35,
      minQuantity: 25,
      optimalQuantity: 40,
      maxQuantity: 60,
      leadTime: 30,
      safetyStock: 15,
      forecastAccuracy: 92,
      serviceLevel: 98,
      lastUpdated: "2024-03-25"
    }
  ]);

  const [reconciliationMethod, setReconciliationMethod] = useState<"top-down" | "bottom-up">("top-down");
  const [selectedLevel, setSelectedLevel] = useState<string>("product");
  const [isReconciling, setIsReconciling] = useState(false);

  const hierarchyLevels = [
    { value: "product", label: "Product Level" },
    { value: "category", label: "Category Level" },
    { value: "region", label: "Regional Level" },
    { value: "total", label: "Total Level" },
  ];

  const mockData: { level: string; forecast: number; actual: number; difference: number; }[] = [
    { level: "SKU001", forecast: 100, actual: 95, difference: -5 },
    { level: "SKU002", forecast: 150, actual: 160, difference: 10 },
    { level: "SKU003", forecast: 80, actual: 75, difference: -5 },
  ];

  const handleReconciliation = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
    }, 1500);
  };

  const handleStartEdit = (rowId: string, field: EditableCell['field'], value: number) => {
    setEditingCell({ rowId, field, value });
  };

  const validateQuantities = (rowId: string, field: string, newValue: number): boolean => {
    const row = distributionData.find(item => item.id === rowId);
    if (!row) return false;

    const min = field === 'minQuantity' ? newValue : row.minQuantity;
    const optimal = field === 'optimalQuantity' ? newValue : row.optimalQuantity;
    const max = field === 'maxQuantity' ? newValue : row.maxQuantity;

    if (min > optimal || optimal > max) {
      toast({
        variant: "destructive",
        title: "Invalid quantity",
        description: "Min ≤ Optimal ≤ Max must be maintained"
      });
      return false;
    }

    return true;
  };

  const handleSave = (value: string) => {
    if (!editingCell) return;

    const numValue = Number(value);
    if (isNaN(numValue)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid number"
      });
      return;
    }

    if (!validateQuantities(editingCell.rowId, editingCell.field, numValue)) {
      return;
    }

    setDistributionData(prev => prev.map(item => {
      if (item.id === editingCell.rowId) {
        return {
          ...item,
          [editingCell.field]: numValue,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    toast({
      title: "Success",
      description: "Value updated successfully"
    });

    setEditingCell(null);
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  const getServiceLevelColor = (level: number) => {
    if (level >= 95) return "text-green-600";
    if (level >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getForecastAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Distribution Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Distribution Quantities</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Min Quantity</TableHead>
                  <TableHead className="text-right">Optimal Quantity</TableHead>
                  <TableHead className="text-right">Max Quantity</TableHead>
                  <TableHead className="text-right">Lead Time (days)</TableHead>
                  <TableHead className="text-right">Safety Stock</TableHead>
                  <TableHead className="text-right">Forecast Accuracy (%)</TableHead>
                  <TableHead className="text-right">Service Level (%)</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributionData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-right">{row.currentStock}</TableCell>
                    <TableCell className="text-right">
                      {editingCell?.rowId === row.id && editingCell?.field === 'minQuantity' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            defaultValue={editingCell.value}
                            className="w-24 text-right"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSave((e.target as HTMLInputElement).value);
                              } else if (e.key === 'Escape') {
                                handleCancel();
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSave((document.querySelector('input[type="number"]') as HTMLInputElement).value)}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
                          onClick={() => handleStartEdit(row.id, 'minQuantity', row.minQuantity)}
                        >
                          {row.minQuantity}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingCell?.rowId === row.id && editingCell?.field === 'optimalQuantity' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            defaultValue={editingCell.value}
                            className="w-24 text-right"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSave((e.target as HTMLInputElement).value);
                              } else if (e.key === 'Escape') {
                                handleCancel();
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSave((document.querySelector('input[type="number"]') as HTMLInputElement).value)}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
                          onClick={() => handleStartEdit(row.id, 'optimalQuantity', row.optimalQuantity)}
                        >
                          {row.optimalQuantity}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingCell?.rowId === row.id && editingCell?.field === 'maxQuantity' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            defaultValue={editingCell.value}
                            className="w-24 text-right"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSave((e.target as HTMLInputElement).value);
                              } else if (e.key === 'Escape') {
                                handleCancel();
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSave((document.querySelector('input[type="number"]') as HTMLInputElement).value)}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
                          onClick={() => handleStartEdit(row.id, 'maxQuantity', row.maxQuantity)}
                        >
                          {row.maxQuantity}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{row.leadTime}</TableCell>
                    <TableCell className="text-right">
                      {editingCell?.rowId === row.id && editingCell?.field === 'safetyStock' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            defaultValue={editingCell.value}
                            className="w-24 text-right"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSave((e.target as HTMLInputElement).value);
                              } else if (e.key === 'Escape') {
                                handleCancel();
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSave((document.querySelector('input[type="number"]') as HTMLInputElement).value)}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
                          onClick={() => handleStartEdit(row.id, 'safetyStock', row.safetyStock)}
                        >
                          {row.safetyStock}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={`text-right ${getForecastAccuracyColor(row.forecastAccuracy)}`}>
                      {row.forecastAccuracy}%
                    </TableCell>
                    <TableCell className={`text-right ${getServiceLevelColor(row.serviceLevel)}`}>
                      {row.serviceLevel}%
                    </TableCell>
                    <TableCell>{row.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Original Distribution Analysis */}
        <Card className="xl:col-span-2 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Forecast Distribution</h3>
            {/* Your existing distribution analysis content */}
          </div>
        </Card>

        {/* Reconciliation Controls */}
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
                Reconcile
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Method</label>
                <div className="flex gap-2">
                  <Button
                    variant={reconciliationMethod === "top-down" ? "default" : "outline"}
                    onClick={() => setReconciliationMethod("top-down")}
                    className="flex-1 gap-2"
                    size="sm"
                  >
                    <ArrowDown className="h-4 w-4" />
                    Top-Down
                  </Button>
                  <Button
                    variant={reconciliationMethod === "bottom-up" ? "default" : "outline"}
                    onClick={() => setReconciliationMethod("bottom-up")}
                    className="flex-1 gap-2"
                    size="sm"
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

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Discrepancies</h4>
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
                      {item.level}: {Math.abs(item.difference)}% {item.difference > 0 ? "above" : "below"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Reconciliation Impact Chart */}
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
                  dataKey="actual"
                  stroke="#82ca9d"
                  name="Reconciled Forecast"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#8884d8"
                  name="Original Forecast"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};
