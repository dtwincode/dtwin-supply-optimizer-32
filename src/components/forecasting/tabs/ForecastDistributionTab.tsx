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
  BarChart,
  Bar,
} from "recharts";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
  const [selectedSKU, setSelectedSKU] = useState<string>("SKU001");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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
        description: "Distribution quantities have been reconciled successfully."
      });
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

  const generateWeeklyDistribution = (sku: string) => {
    const skuData = distributionData.find(d => d.sku === sku);
    if (!skuData) return [];

    return Array.from({ length: 4 }).map((_, i) => ({
      week: `Week ${i + 1}`,
      planned: skuData.optimalQuantity / 4,
      minimum: skuData.minQuantity / 4,
      maximum: skuData.maxQuantity / 4
    }));
  };

  const getQuantitiesChartData = () => {
    return distributionData.map(item => ({
      sku: item.sku,
      "Min Quantity": item.minQuantity,
      "Optimal Quantity": item.optimalQuantity,
      "Max Quantity": item.maxQuantity,
      "Current Stock": item.currentStock
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Distribution Table */}
      <Card className="p-6 shadow-sm">
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

      {/* Impact Analysis Section */}
      <Card className="p-6 shadow-sm">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Distribution Impact Analysis</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-4">Reconciliation Method</h4>
              <div className="space-y-4">
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

                <Button 
                  onClick={handleReconciliation}
                  disabled={isReconciling}
                  className="w-[200px]"
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

      {/* Distribution Charts Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <Card className="p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Distribution Quantities Comparison</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getQuantitiesChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sku" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Min Quantity" fill="#8884d8" />
                  <Bar dataKey="Optimal Quantity" fill="#82ca9d" />
                  <Bar dataKey="Max Quantity" fill="#ffc658" />
                  <Bar dataKey="Current Stock" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Weekly Distribution</h3>
              <Select value={selectedSKU} onValueChange={setSelectedSKU}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select SKU" />
                </SelectTrigger>
                <SelectContent>
                  {distributionData.map(item => (
                    <SelectItem key={item.sku} value={item.sku}>
                      {item.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateWeeklyDistribution(selectedSKU)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="planned" 
                    stroke="#82ca9d" 
                    name="Planned Quantity"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minimum" 
                    stroke="#8884d8" 
                    strokeDasharray="5 5"
                    name="Minimum"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="maximum" 
                    stroke="#ffc658" 
                    strokeDasharray="5 5"
                    name="Maximum"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Distribution Calendar</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h4 className="font-medium">Distribution for {format(selectedDate, 'MMM dd, yyyy')}</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Planned: {Math.round(distributionData.find(d => d.sku === selectedSKU)?.optimalQuantity / 30 || 0)} units
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Minimum: {Math.round(distributionData.find(d => d.sku === selectedSKU)?.minQuantity / 30 || 0)} units
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maximum: {Math.round(distributionData.find(d => d.sku === selectedSKU)?.maxQuantity / 30 || 0)} units
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
