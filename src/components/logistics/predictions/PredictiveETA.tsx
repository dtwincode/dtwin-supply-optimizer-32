import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface ShipmentPrediction {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  originalETA: string;
  predictedETA: string;
  confidence: number;
  factors: string[];
  status: "on_time" | "delayed" | "early" | "at_risk";
  riskFactors?: string[];
}

export const PredictiveETA: React.FC = () => {
  const { language } = useLanguage();
  const [predictions, setPredictions] = useState<ShipmentPrediction[]>([
    {
      id: "ship-001",
      reference: "ORD-20240315-001",
      origin: "Riyadh",
      destination: "Jeddah",
      originalETA: "2024-03-17T16:00:00",
      predictedETA: "2024-03-17T20:30:00",
      confidence: 92,
      factors: [
        "Weather in Jeddah",
        "Traffic congestion",
        "Historical carrier performance",
      ],
      status: "delayed",
      riskFactors: ["Heavy rain forecast", "Road construction"],
    },
    {
      id: "ship-002",
      reference: "ORD-20240314-002",
      origin: "Dammam",
      destination: "Riyadh",
      originalETA: "2024-03-18T14:00:00",
      predictedETA: "2024-03-18T12:45:00",
      confidence: 88,
      factors: ["Light traffic conditions", "Carrier performance trending up"],
      status: "early",
    },
    {
      id: "ship-003",
      reference: "ORD-20240313-003",
      origin: "Mecca",
      destination: "Medina",
      originalETA: "2024-03-19T11:00:00",
      predictedETA: "2024-03-19T11:15:00",
      confidence: 95,
      factors: ["Historical route data", "Carrier reliability score"],
      status: "on_time",
    },
    {
      id: "ship-004",
      reference: "ORD-20240312-004",
      origin: "Jeddah",
      destination: "Tabuk",
      originalETA: "2024-03-20T16:30:00",
      predictedETA: "2024-03-21T09:15:00",
      confidence: 76,
      factors: [
        "Long-haul route variability",
        "Weather forecast changes",
        "Historical delays",
      ],
      status: "at_risk",
      riskFactors: ["Sandstorm warning", "High temperature alert"],
    },
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTimeDifference = (original: string, predicted: string) => {
    const diff = new Date(predicted).getTime() - new Date(original).getTime();
    const hours = Math.abs(Math.round((diff / (1000 * 60 * 60)) * 10) / 10);

    if (diff === 0) return "";

    return diff > 0
      ? `+${hours} ${getTranslation("logistics.hours", language) || "hrs"}`
      : `-${hours} ${getTranslation("logistics.hours", language) || "hrs"}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on_time":
        return (
          <Badge className="bg-green-100 text-green-800">
            {getTranslation("logistics.onTime", language) || "On Time"}
          </Badge>
        );
      case "delayed":
        return (
          <Badge className="bg-red-100 text-red-800">
            {getTranslation("logistics.delayed", language) || "Delayed"}
          </Badge>
        );
      case "early":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {getTranslation("logistics.early", language) || "Early"}
          </Badge>
        );
      case "at_risk":
        return (
          <Badge className="bg-amber-100 text-amber-800">
            {getTranslation("logistics.atRisk", language) || "At Risk"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 75) return "text-amber-600";
    return "text-red-600";
  };

  const getTrendIcon = (status: string) => {
    switch (status) {
      case "on_time":
        return null;
      case "delayed":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "early":
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case "at_risk":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const t = (key: string) => getTranslation(key, language) || key;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-5 w-5 text-dtwin-medium" />
          {t("logistics.predictiveETA")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("logistics.shipment")}</TableHead>
              <TableHead>{t("logistics.route")}</TableHead>
              <TableHead>{t("logistics.originalETA")}</TableHead>
              <TableHead>{t("logistics.predictedETA")}</TableHead>
              <TableHead>{t("logistics.confidence")}</TableHead>
              <TableHead>{t("logistics.statusLabel")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction) => (
              <TableRow key={prediction.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  {prediction.reference}
                </TableCell>
                <TableCell>
                  {prediction.origin} → {prediction.destination}
                </TableCell>
                <TableCell>{formatDate(prediction.originalETA)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {formatDate(prediction.predictedETA)}
                    {prediction.status !== "on_time" && (
                      <span className="ml-2 text-sm font-medium text-muted-foreground">
                        {getTimeDifference(
                          prediction.originalETA,
                          prediction.predictedETA
                        )}
                      </span>
                    )}
                    {getTrendIcon(prediction.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={getConfidenceColor(prediction.confidence)}>
                    {prediction.confidence}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(prediction.status)}

                    {prediction.riskFactors && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Eye className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <div className="p-2">
                              <p className="font-medium mb-2">
                                {t("logistics.impactFactors")}:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                {prediction.riskFactors.map((factor, idx) => (
                                  <li key={idx} className="text-sm">
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
