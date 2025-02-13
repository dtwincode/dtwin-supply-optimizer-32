
import { Button } from "@/components/ui/button";
import { FileDown, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelParametersDialog } from "./ModelParametersDialog";
import { useState } from "react";

interface ForecastingHeaderProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
}

export const ForecastingHeader = ({
  selectedModel,
  setSelectedModel,
  onExportCSV,
  onExportExcel,
}: ForecastingHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="moving-avg">Moving Average</SelectItem>
            <SelectItem value="exp-smoothing">Exponential Smoothing</SelectItem>
            <SelectItem value="arima">ARIMA</SelectItem>
            <SelectItem value="prophet">Prophet</SelectItem>
            <SelectItem value="sarima">Seasonal ARIMA</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Parameters
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportCSV} className="flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={onExportExcel} className="flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Export Excel
        </Button>
      </div>
    </div>
  );
};
