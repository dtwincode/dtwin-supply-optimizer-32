import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EditableCell {
  rowId: string;
  field: 'minQuantity' | 'optimalQuantity' | 'maxQuantity' | 'safetyStock' | 'serviceLevel';
  value: number;
}

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

interface DistributionQuantitiesTableProps {
  distributionData: DistributionData[];
  onUpdateDistributionData: (newData: DistributionData[]) => void;
  forecastPeriod: string;
}

export const DistributionQuantitiesTable = ({ 
  distributionData,
  onUpdateDistributionData,
  forecastPeriod
}: DistributionQuantitiesTableProps) => {
  const { toast } = useToast();
  const { t } = useI18n();
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);

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
        title: t("forecasting.invalidQuantity") || "Invalid quantity",
        description: t("forecasting.quantityConstraint") || "Min ≤ Optimal ≤ Max must be maintained"
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
        title: t("common.error") || "Invalid input",
        description: t("forecasting.enterValidNumber") || "Please enter a valid number"
      });
      return;
    }

    if (!validateQuantities(editingCell.rowId, editingCell.field, numValue)) {
      return;
    }

    const newData = distributionData.map(item => {
      if (item.id === editingCell.rowId) {
        return {
          ...item,
          [editingCell.field]: numValue,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    onUpdateDistributionData(newData);
    toast({
      title: t("common.success") || "Success",
      description: t("forecasting.valueUpdated") || "Value updated successfully"
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
    <Card className="p-6 shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("forecasting.distributionQuantities") || "Distribution Quantities"}</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.sku") || "SKU"}</TableHead>
                <TableHead>{t("forecasting.category") || "Category"}</TableHead>
                <TableHead className="text-right">{t("forecasting.currentStock") || "Current Stock"}</TableHead>
                <TableHead className="text-right">{t("forecasting.minQuantity") || "Min Quantity"}</TableHead>
                <TableHead className="text-right">{t("forecasting.optimalQuantity") || "Optimal Quantity"}</TableHead>
                <TableHead className="text-right">{t("forecasting.maxQuantity") || "Max Quantity"}</TableHead>
                <TableHead className="text-right">{t("forecasting.leadTimeDays") || "Lead Time (days)"}</TableHead>
                <TableHead className="text-right">{t("forecasting.safetyStock") || "Safety Stock"}</TableHead>
                <TableHead className="text-right">{t("forecasting.forecastAccuracy") || "Forecast Accuracy (%)"}</TableHead>
                <TableHead className="text-right">{t("forecasting.serviceLevel") || "Service Level (%)"}</TableHead>
                <TableHead>{t("forecasting.lastUpdated") || "Last Updated"}</TableHead>
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
  );
};
