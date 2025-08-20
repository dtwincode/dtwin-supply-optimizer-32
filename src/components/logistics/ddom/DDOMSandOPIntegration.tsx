import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  TrendingUp,
  BarChart,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Download,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  generateDDSOPReport,
  DDSOPStrategicAdjustment,
} from "@/utils/ddsopCalculations";

const sopCycles = [
  {
    id: 1,
    name: "Monthly S&OP Cycle",
    nextDate: "2024-07-15",
    lastCompleted: "2024-06-15",
    status: "on-track",
    complianceScore: 92,
  },
  {
    id: 2,
    name: "Quarterly Strategic Review",
    nextDate: "2024-09-01",
    lastCompleted: "2024-06-01",
    status: "upcoming",
    complianceScore: 88,
  },
];

const reconciliationMetrics = [
  {
    id: "supply-demand",
    name: "Supply-Demand Balance",
    value: 87,
    target: 95,
    status: "warning",
  },
  {
    id: "buffer-alignment",
    name: "Buffer Alignment",
    value: 92,
    target: 90,
    status: "success",
  },
  {
    id: "financial-reconciliation",
    name: "Financial Reconciliation",
    value: 84,
    target: 85,
    status: "warning",
  },
  {
    id: "ddsop-compliance",
    name: "DDS&OP Compliance",
    value: 90,
    target: 85,
    status: "success",
  },
];

const strategicAdjustments = [
  {
    id: 1,
    description: "Increase safety stock for high-volatility items",
    impact: "medium",
    status: "pending",
    date: "2024-06-25",
    alignedWithDDSOP: true,
  },
  {
    id: 2,
    description: "Adjust replenishment frequency for seasonal products",
    impact: "high",
    status: "approved",
    date: "2024-06-22",
    alignedWithDDSOP: true,
  },
  {
    id: 3,
    description: "Review buffer profiles for electronic components",
    impact: "medium",
    status: "pending",
    date: "2024-06-20",
    alignedWithDDSOP: true,
  },
  {
    id: 4,
    description: "Adjust lead time factors for overseas suppliers",
    impact: "high",
    status: "in-review",
    date: "2024-06-18",
    alignedWithDDSOP: false,
  },
];

const ddsopSteps = [
  {
    id: 1,
    name: "Demand Review",
    status: "completed",
    date: "2024-06-10",
    notes: "Conducted full review of demand drivers and signals",
  },
  {
    id: 2,
    name: "Supply Review",
    status: "completed",
    date: "2024-06-12",
    notes: "Reviewed buffer status and projections",
  },
  {
    id: 3,
    name: "Integrated Reconciliation",
    status: "completed",
    date: "2024-06-14",
    notes: "Aligned tactical and strategic objectives",
  },
  {
    id: 4,
    name: "Management Business Review",
    status: "pending",
    date: "2024-06-20",
    notes: "Final approval pending executive committee",
  },
];

export const DDOMSandOPIntegration: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) =>
    getTranslation(`logistics.ddom.${key}`, language) || key;
  const [activeTab, setActiveTab] = useState("cycles");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [strategicBufferAdjustments, setStrategicBufferAdjustments] = useState<
    DDSOPStrategicAdjustment[]
  >([]);
  const [showStrategicAdjustments, setShowStrategicAdjustments] =
    useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-green-600">{t("onTrack")}</Badge>;
      case "warning":
        return <Badge className="bg-amber-600">{t("warning")}</Badge>;
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {t("upcoming")}
          </Badge>
        );
      case "success":
        return <Badge className="bg-green-600">{t("success")}</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            {t("pending")}
          </Badge>
        );
      case "approved":
        return <Badge className="bg-green-600">{t("approved")}</Badge>;
      case "in-review":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {t("inReview")}
          </Badge>
        );
      case "completed":
        return <Badge className="bg-green-600">{t("completed")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-600">{t("highImpact")}</Badge>;
      case "medium":
        return <Badge className="bg-amber-600">{t("mediumImpact")}</Badge>;
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t("lowImpact")}
          </Badge>
        );
      default:
        return <Badge>{impact}</Badge>;
    }
  };

  const handleReconciliationClick = () => {
    toast.success(t("reconciliationStarted"));
  };

  const handleViewProjections = () => {
    toast.info(t("projectionsLoaded"));
  };

  const handleReviewAdjustment = (id: number) => {
    toast.success(t(`adjustmentReviewed`).replace("{id}", id.toString()));
  };

  const handleGenerateDDSOPReport = async () => {
    setIsGeneratingReport(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reportData = await generateDDSOPReport({
        cycleData: sopCycles[0],
        metrics: reconciliationMetrics,
        adjustments: strategicAdjustments,
        stepData: ddsopSteps,
      });

      if (reportData.strategicAdjustments) {
        setStrategicBufferAdjustments(reportData.strategicAdjustments);
        setShowStrategicAdjustments(true);
      }

      toast.success("DDS&OP Report generated successfully");

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DDSOP_Report_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating DDS&OP report:", error);
      toast.error("Failed to generate DDS&OP report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-dtwin-medium" />
            {t("sandopIntegration")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              <ShieldCheck className="h-3 w-3 mr-1" />
              DDS&OP Compliant
            </Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {t("active")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="cycles" onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="cycles">{t("sopCycles")}</TabsTrigger>
              <TabsTrigger value="reconciliation">
                {t("reconciliation")}
              </TabsTrigger>
              <TabsTrigger value="adjustments">
                {t("tacticalAdjustments")}
              </TabsTrigger>
              <TabsTrigger value="ddsop">DDS&OP Steps</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cycles" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="space-y-4">
                {sopCycles.map((cycle) => (
                  <div key={cycle.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <p className="font-medium">{cycle.name}</p>
                          <div className="ml-2">
                            {getStatusBadge(cycle.status)}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">
                            {t("nextCycle")}: {cycle.nextDate}
                          </span>
                          <Calendar className="h-3 w-3 mr-1 ml-2" />
                          <span>
                            {t("lastCompleted")}: {cycle.lastCompleted}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm font-medium">
                            DDS&OP Compliance: {cycle.complianceScore}%
                          </span>
                          <Progress
                            value={cycle.complianceScore}
                            max={100}
                            className={`h-2 mt-1 ${
                              cycle.complianceScore >= 90
                                ? "bg-green-500"
                                : cycle.complianceScore >= 80
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleViewProjections}
                        className="text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {t("viewDetails")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleViewProjections}
                >
                  <TrendingUp className="h-4 w-4" />
                  {t("viewProjections")}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  {t("scenarioPlanning")}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reconciliation" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {reconciliationMetrics.map((metric) => (
                  <div key={metric.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">{metric.name}</p>
                      <span className="text-sm font-semibold">
                        {metric.value}%
                      </span>
                    </div>
                    <Progress
                      value={metric.value}
                      max={100}
                      className={`h-2 ${
                        metric.status === "success"
                          ? "bg-green-500"
                          : metric.status === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>
                        {t("target")}: {metric.target}%
                      </span>
                      <div className="flex items-center">
                        <span className="mr-2">{t("status")}:</span>
                        {getStatusBadge(metric.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border rounded-md p-3 mb-4">
                <h3 className="text-sm font-medium mb-2">
                  {t("lastDdmrpReconciliation")}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">May 30, 2024</span>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleReconciliationClick}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("startReconciliation")}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  {t("demandSupplyReconciliation")}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("reconciliationReport")}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="adjustments" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="space-y-4">
                {strategicAdjustments.map((adjustment) => (
                  <div key={adjustment.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center">
                          <AlertCircle
                            className={`h-4 w-4 mr-2 ${
                              adjustment.impact === "high"
                                ? "text-red-500"
                                : adjustment.impact === "medium"
                                  ? "text-amber-500"
                                  : "text-green-500"
                            }`}
                          />
                          <p className="font-medium text-sm">
                            {adjustment.description}
                          </p>
                        </div>
                        <div className="flex items-center mt-1">
                          {getImpactBadge(adjustment.impact)}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {adjustment.date}
                          </span>
                          {adjustment.alignedWithDDSOP && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              DDS&OP Aligned
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {getStatusBadge(adjustment.status)}
                        {adjustment.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs mt-1"
                            onClick={() =>
                              handleReviewAdjustment(adjustment.id)
                            }
                          >
                            {t("review")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ddsop" className="m-0 p-0">
            <div className="px-6 pt-4 pb-4">
              <div className="border rounded-md p-4 mb-4">
                <div className="flex items-center mb-3">
                  <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">DDS&OP Compliance Status</h3>
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    Certified
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Demand Driven S&OP process aligns strategic and tactical
                  supply chain decisions with business objectives through a
                  bi-directional integration process.
                </p>
                <Progress
                  value={90}
                  max={100}
                  className="h-2 bg-blue-500 mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Overall Compliance: 90%</span>
                  <span>Next Review: July 15, 2024</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium px-1">
                  DDS&OP Process Steps
                </h3>
                {ddsopSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index > 0 && (
                      <div className="absolute left-4 -top-3 h-3 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="flex items-start border rounded-md p-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 mr-3 flex-shrink-0">
                        {step.id}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{step.name}</h4>
                          {getStatusBadge(step.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.notes}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {step.date}
                        </div>
                      </div>
                    </div>
                    {index < ddsopSteps.length - 1 && (
                      <div className="absolute left-4 -bottom-3 h-3 w-0.5 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>

              {showStrategicAdjustments &&
                strategicBufferAdjustments.length > 0 && (
                  <div className="mt-6 border rounded-md p-4">
                    <div className="flex items-center mb-3">
                      <Settings className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">
                        Strategic Buffer Adjustments
                      </h3>
                      <Badge className="ml-2 bg-blue-100 text-blue-800">
                        Bi-directional
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      DDS&OP recommended strategic adjustments to tactical
                      buffers based on business objectives and market
                      conditions.
                    </p>

                    <div className="space-y-3 mt-3">
                      {strategicBufferAdjustments.map((adjustment) => (
                        <div
                          key={adjustment.id}
                          className="border rounded-md p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {adjustment.bufferType}
                              </h4>
                              <p className="text-sm mt-1">
                                {adjustment.reason}
                              </p>
                              <div className="flex items-center mt-2 text-sm">
                                <span className="text-muted-foreground">
                                  Current: {adjustment.currentValue}
                                </span>
                                <ArrowRight className="h-3 w-3 mx-2" />
                                <span className="font-medium">
                                  Recommended: {adjustment.recommendedValue}
                                </span>
                              </div>
                              <div className="mt-2">
                                <Badge
                                  className={`${
                                    adjustment.impact === "high"
                                      ? "bg-red-100 text-red-800"
                                      : adjustment.impact === "medium"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {adjustment.impact.charAt(0).toUpperCase() +
                                    adjustment.impact.slice(1)}{" "}
                                  Impact
                                </Badge>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {adjustment.strategy}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toast.success(
                                  `Applied adjustment to ${adjustment.bufferType}`
                                )
                              }
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="mt-4 flex justify-center">
                <Button
                  className="flex items-center gap-2"
                  onClick={handleGenerateDDSOPReport}
                  disabled={isGeneratingReport}
                >
                  <FileText className="h-4 w-4" />
                  {isGeneratingReport
                    ? "Generating Report..."
                    : "Generate DDS&OP Report"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
