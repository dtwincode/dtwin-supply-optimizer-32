
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface SupplierPerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: any | null;
}

export const SupplierPerformanceDialog = ({
  open,
  onOpenChange,
  supplier,
}: SupplierPerformanceDialogProps) => {
  const { language } = useLanguage();

  if (!supplier) return null;

  // Mock performance history data
  const performanceHistory = [
    {
      month: "Jan",
      reliability: 88,
      leadTime: 85,
      quality: 92,
      cost: 84,
    },
    {
      month: "Feb",
      reliability: 90,
      leadTime: 87,
      quality: 94,
      cost: 85,
    },
    {
      month: "Mar",
      reliability: 89,
      leadTime: 86,
      quality: 93,
      cost: 86,
    },
    {
      month: "Apr",
      reliability: 91,
      leadTime: 87,
      quality: 94,
      cost: 88,
    },
    {
      month: "May",
      reliability: 92,
      leadTime: 88,
      quality: 95,
      cost: 87,
    },
    {
      month: "Jun",
      reliability: 92,
      leadTime: 88,
      quality: 95,
      cost: 87,
    },
  ];

  // Mock delivery data
  const deliveryData = [
    { status: "On Time", count: 32 },
    { status: "1-2 Days Late", count: 8 },
    { status: "3+ Days Late", count: 4 },
    { status: "Early", count: 6 },
  ];

  // Mock quality issues data
  const qualityIssuesData = [
    { issue: "Damaged", count: 3 },
    { issue: "Wrong Item", count: 1 },
    { issue: "Incomplete", count: 2 },
    { issue: "Quality Issue", count: 5 },
  ];

  // Calculate overall performance score (weighted average)
  const overallScore =
    supplier.reliability * 0.3 +
    supplier.lead_time_adherence * 0.25 +
    supplier.quality_score * 0.3 +
    supplier.cost_efficiency * 0.15;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{supplier.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">
              {getTranslation("supplyPlanning.overview", language)}
            </TabsTrigger>
            <TabsTrigger value="metrics">
              {getTranslation("supplyPlanning.detailedMetrics", language)}
            </TabsTrigger>
            <TabsTrigger value="issues">
              {getTranslation("supplyPlanning.issuesAnalysis", language)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {getTranslation("supplyPlanning.overallPerformance", language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                    {Math.round(overallScore)}%
                  </div>
                  <Progress value={overallScore} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {getTranslation("supplyPlanning.preferredFor", language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {supplier.preferred_for_skus.map((sku: string) => (
                      <Badge key={sku} variant="outline">
                        {sku}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {getTranslation("supplyPlanning.performanceBreakdown", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {getTranslation("supplyPlanning.reliability", language)}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(supplier.reliability)}`}>
                      {supplier.reliability}%
                    </div>
                    <Progress value={supplier.reliability} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {getTranslation("supplyPlanning.leadTimeAdherence", language)}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(supplier.lead_time_adherence)}`}>
                      {supplier.lead_time_adherence}%
                    </div>
                    <Progress value={supplier.lead_time_adherence} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {getTranslation("supplyPlanning.qualityScore", language)}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(supplier.quality_score)}`}>
                      {supplier.quality_score}%
                    </div>
                    <Progress value={supplier.quality_score} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {getTranslation("supplyPlanning.costEfficiency", language)}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(supplier.cost_efficiency)}`}>
                      {supplier.cost_efficiency}%
                    </div>
                    <Progress value={supplier.cost_efficiency} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {getTranslation("supplyPlanning.contactInformation", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">
                      {getTranslation("supplyPlanning.contactName", language)}
                    </div>
                    <div>{supplier.contact_info.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {getTranslation("supplyPlanning.contactEmail", language)}
                    </div>
                    <div>{supplier.contact_info.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {getTranslation("supplyPlanning.contactPhone", language)}
                    </div>
                    <div>{supplier.contact_info.phone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {getTranslation("supplyPlanning.performanceHistory", language)}
                </CardTitle>
                <CardDescription>
                  {getTranslation("supplyPlanning.sixMonthTrend", language)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceHistory}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="reliability"
                        name={getTranslation("supplyPlanning.metrics.reliability", language)}
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="leadTime"
                        name={getTranslation("supplyPlanning.metrics.leadTime", language)}
                        stroke="#10B981"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="quality"
                        name={getTranslation("supplyPlanning.metrics.quality", language)}
                        stroke="#F59E0B"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        name={getTranslation("supplyPlanning.metrics.cost", language)}
                        stroke="#8B5CF6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {getTranslation("supplyPlanning.deliveryPerformance", language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={deliveryData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          name={getTranslation("supplyPlanning.orderCount", language)}
                          fill="#3B82F6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {getTranslation("supplyPlanning.qualityIssues", language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={qualityIssuesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="issue" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          name={getTranslation("supplyPlanning.issueCount", language)}
                          fill="#F59E0B"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {getTranslation("supplyPlanning.improvementAreas", language)}
                </CardTitle>
                <CardDescription>
                  {getTranslation("supplyPlanning.improvementAreasDesc", language)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">
                    {getTranslation("supplyPlanning.leadTimeConsistency", language)}
                  </h3>
                  <p className="text-sm text-amber-700">
                    {getTranslation("supplyPlanning.leadTimeConsistencyDesc", language)}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">
                    {getTranslation("supplyPlanning.qualityControl", language)}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {getTranslation("supplyPlanning.qualityControlDesc", language)}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">
                    {getTranslation("supplyPlanning.costOptimization", language)}
                  </h3>
                  <p className="text-sm text-green-700">
                    {getTranslation("supplyPlanning.costOptimizationDesc", language)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {getTranslation("supplyPlanning.riskAssessment", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {getTranslation("supplyPlanning.supplyRisk", language)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTranslation("supplyPlanning.supplyRiskDesc", language)}
                      </div>
                    </div>
                    <Badge className="bg-yellow-500">
                      {getTranslation("supplyPlanning.medium", language)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {getTranslation("supplyPlanning.financialRisk", language)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTranslation("supplyPlanning.financialRiskDesc", language)}
                      </div>
                    </div>
                    <Badge className="bg-green-500">
                      {getTranslation("supplyPlanning.low", language)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {getTranslation("supplyPlanning.qualityRisk", language)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTranslation("supplyPlanning.qualityRiskDesc", language)}
                      </div>
                    </div>
                    <Badge className="bg-green-500">
                      {getTranslation("supplyPlanning.low", language)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {getTranslation("supplyPlanning.complianceRisk", language)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTranslation("supplyPlanning.complianceRiskDesc", language)}
                      </div>
                    </div>
                    <Badge className="bg-green-500">
                      {getTranslation("supplyPlanning.low", language)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
