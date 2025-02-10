
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePdf, FileSpreadsheet, FilePpt, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const reportTypes = [
  { id: "sales-summary", name: "Sales Summary Report" },
  { id: "product-performance", name: "Product Performance Analysis" },
  { id: "regional-analysis", name: "Regional Sales Analysis" },
  { id: "forecast-comparison", name: "Forecast vs Actual Comparison" },
];

const timeFrames = [
  { id: "last-30-days", name: "Last 30 Days" },
  { id: "last-quarter", name: "Last Quarter" },
  { id: "last-year", name: "Last Year" },
  { id: "ytd", name: "Year to Date" },
];

export const ReportGenerator = () => {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>("");
  const { toast } = useToast();

  const handleGenerateReport = (format: "pdf" | "excel" | "ppt") => {
    // This is where you would implement the actual report generation logic
    // For now, we'll just show a toast notification
    toast({
      title: "Report Generated",
      description: `${selectedReport} for ${selectedTimeFrame} has been generated in ${format.toUpperCase()} format.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select onValueChange={setSelectedReport} value={selectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Frame</label>
              <Select onValueChange={setSelectedTimeFrame} value={selectedTimeFrame}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                  {timeFrames.map((frame) => (
                    <SelectItem key={frame.id} value={frame.id}>
                      {frame.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Export Options</h3>
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleGenerateReport("pdf")}
              disabled={!selectedReport || !selectedTimeFrame}
            >
              <FilePdf className="h-4 w-4" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleGenerateReport("excel")}
              disabled={!selectedReport || !selectedTimeFrame}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export as Excel
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleGenerateReport("ppt")}
              disabled={!selectedReport || !selectedTimeFrame}
            >
              <FilePpt className="h-4 w-4" />
              Export as PowerPoint
            </Button>
          </div>
        </Card>
      </div>

      {selectedReport && selectedTimeFrame && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Report Preview</h3>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Preview
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">
              Preview for {reportTypes.find(r => r.id === selectedReport)?.name} will be displayed here
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
