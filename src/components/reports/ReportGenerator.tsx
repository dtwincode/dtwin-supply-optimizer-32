
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
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";

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
  const [reportDescription, setReportDescription] = useState<string>("");
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const generateReportDescription = async (reportType: string) => {
    setIsLoadingDescription(true);
    try {
      const response = await fetch('https://b006500d-faf3-4127-884e-bcd01399fc3d.functions.supabase.co/generate-report-description', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reportType: reportTypes.find(r => r.id === reportType)?.name 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report description');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setReportDescription(data.description);
    } catch (error) {
      console.error('Error generating report description:', error);
      toast({
        title: t("common.error"),
        description: t("reports.descriptionError") || "Failed to generate report description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDescription(false);
    }
  };

  const handleReportChange = (value: string) => {
    setSelectedReport(value);
    if (value) {
      generateReportDescription(value);
    } else {
      setReportDescription("");
    }
  };

  const handleGenerateReport = (format: "pdf" | "excel" | "ppt") => {
    toast({
      title: t("reports.generated") || "Report Generated",
      description: t("reports.generatedDesc", { report: selectedReport, timeFrame: selectedTimeFrame, format: format.toUpperCase() }) || 
                  `${selectedReport} for ${selectedTimeFrame} has been generated in ${format.toUpperCase()} format.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t("reports.configuration") || "Report Configuration"}</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("reports.type") || "Report Type"}</label>
              <Select onValueChange={handleReportChange} value={selectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder={t("reports.selectType") || "Select report type"} />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingDescription && (
                <p className="text-sm text-gray-500 mt-2">{t("reports.generatingDesc") || "Generating description..."}</p>
              )}
              {reportDescription && !isLoadingDescription && (
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-md">
                  {reportDescription}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("reports.timeFrame") || "Time Frame"}</label>
              <Select onValueChange={setSelectedTimeFrame} value={selectedTimeFrame}>
                <SelectTrigger>
                  <SelectValue placeholder={t("reports.selectTimeFrame") || "Select time frame"} />
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
          <h3 className="text-lg font-semibold mb-4">{t("reports.exportOptions") || "Export Options"}</h3>
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleGenerateReport("pdf")}
              disabled={!selectedReport || !selectedTimeFrame}
            >
              <FileText className="h-4 w-4" />
              {t("reports.exportPDF") || "Export as PDF"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleGenerateReport("excel")}
              disabled={!selectedReport || !selectedTimeFrame}
            >
              <FileText className="h-4 w-4" />
              {t("reports.exportExcel") || "Export as Excel"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleGenerateReport("ppt")}
              disabled={!selectedReport || !selectedTimeFrame}
            >
              <FileText className="h-4 w-4" />
              {t("reports.exportPPT") || "Export as PowerPoint"}
            </Button>
          </div>
        </Card>
      </div>

      {selectedReport && selectedTimeFrame && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("reports.preview") || "Report Preview"}</h3>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {t("reports.downloadPreview") || "Download Preview"}
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">
              {t("reports.previewText", { 
                report: reportTypes.find(r => r.id === selectedReport)?.name 
              }) || `Preview for ${reportTypes.find(r => r.id === selectedReport)?.name} will be displayed here`}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
