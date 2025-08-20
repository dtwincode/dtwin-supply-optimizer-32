import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const executionItems = [
  {
    id: 1,
    name: "bufferPenetrationResponse",
    status: "on-track",
    metric: "95%",
    target: "90%",
    trend: "improving",
  },
  {
    id: 2,
    name: "resourceUtilization",
    status: "warning",
    metric: "84%",
    target: "85-95%",
    trend: "stable",
  },
  {
    id: 3,
    name: "tacticalCycleAdherence",
    status: "on-track",
    metric: "92%",
    target: "90%",
    trend: "improving",
  },
  {
    id: 4,
    name: "demandSignalQuality",
    status: "alert",
    metric: "78%",
    target: "85%",
    trend: "declining",
  },
  {
    id: 5,
    name: "strategicDecouplingEffectiveness",
    status: "on-track",
    metric: "89%",
    target: "80%",
    trend: "stable",
  },
];

export const DDOMExecutionMetrics: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) =>
    getTranslation(`logistics.ddom.${key}`, language) || key;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-green-600">{t("onTrack")}</Badge>;
      case "warning":
        return <Badge className="bg-amber-600">{t("warning")}</Badge>;
      case "alert":
        return <Badge className="bg-red-600">{t("alert")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return (
          <span className="text-green-600 text-xs flex items-center">
            ↑ {t("improving")}
          </span>
        );
      case "declining":
        return (
          <span className="text-red-600 text-xs flex items-center">
            ↓ {t("declining")}
          </span>
        );
      case "stable":
      default:
        return (
          <span className="text-blue-600 text-xs flex items-center">
            → {t("stable")}
          </span>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-dtwin-medium" />
          {t("executionMetrics")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[300px]">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2 font-medium text-muted-foreground">
                  {t("metric")}
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  {t("status")}
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  {t("actual")}
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  {t("target")}
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  {t("trend")}
                </th>
              </tr>
            </thead>
            <tbody>
              {executionItems.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 text-sm">{t(item.name)}</td>
                  <td className="py-3">{getStatusBadge(item.status)}</td>
                  <td className="py-3 text-sm font-medium">{item.metric}</td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {item.target}
                  </td>
                  <td className="py-3">{getTrendIcon(item.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
