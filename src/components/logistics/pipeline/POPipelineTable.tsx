import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

// Sample data for the purchase order pipeline
const pipelineData = [
  {
    id: "PO-2024-001",
    supplier: "Global Supplies Inc.",
    stage: "manufacturing",
    startDate: "2024-03-01",
    eta: "2024-04-15",
    completion: 65,
    blockers: null,
    priority: "high",
  },
  {
    id: "PO-2024-002",
    supplier: "Tech Components Ltd.",
    stage: "shipping",
    startDate: "2024-02-15",
    eta: "2024-03-30",
    completion: 80,
    blockers: null,
    priority: "medium",
  },
  {
    id: "PO-2024-003",
    supplier: "Precision Parts Co.",
    stage: "customs",
    startDate: "2024-03-10",
    eta: "2024-04-05",
    completion: 45,
    blockers: "Documentation issues",
    priority: "high",
  },
  {
    id: "PO-2024-004",
    supplier: "Quality Materials Corp.",
    stage: "delivery",
    startDate: "2024-02-28",
    eta: "2024-03-25",
    completion: 90,
    blockers: null,
    priority: "low",
  },
];

export const POPipelineTable = () => {
  const { language } = useLanguage();

  const getStageTranslation = (stage: string) => {
    const stageMap: Record<string, string> = {
      manufacturing: language === "en" ? "Manufacturing" : "التصنيع",
      shipping: language === "en" ? "Shipping" : "الشحن",
      customs: language === "en" ? "Customs" : "الجمارك",
      delivery: language === "en" ? "Delivery" : "التسليم",
    };

    return stageMap[stage] || stage;
  };

  const getPriorityVariant = (priority: string) => {
    const priorityMap: Record<string, string> = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };

    return priorityMap[priority] || "default";
  };

  const getPriorityTranslation = (priority: string) => {
    const priorityMap: Record<string, string> = {
      high:
        getTranslation("logistics.highPriority", language) ||
        (language === "en" ? "High" : "عالي"),
      medium:
        getTranslation("logistics.mediumPriority", language) ||
        (language === "en" ? "Medium" : "متوسط"),
      low:
        getTranslation("logistics.lowPriority", language) ||
        (language === "en" ? "Low" : "منخفض"),
    };

    return priorityMap[priority] || priority;
  };

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg font-medium mb-4">
        {getTranslation("logistics.purchaseOrderPipeline", language)}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {getTranslation("logistics.supplier", language)}
            </TableHead>
            <TableHead>{getTranslation("logistics.stage", language)}</TableHead>
            <TableHead>
              {getTranslation("logistics.startDate", language)}
            </TableHead>
            <TableHead>{getTranslation("logistics.eta", language)}</TableHead>
            <TableHead>
              {getTranslation("logistics.completion", language)}
            </TableHead>
            <TableHead>
              {getTranslation("logistics.blockers", language)}
            </TableHead>
            <TableHead>
              {getTranslation("logistics.priority", language)}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pipelineData.map((po) => (
            <TableRow key={po.id}>
              <TableCell className="font-medium">{po.supplier}</TableCell>
              <TableCell>{getStageTranslation(po.stage)}</TableCell>
              <TableCell>{po.startDate}</TableCell>
              <TableCell>{po.eta}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={po.completion} className="w-[60px]" />
                  <span>{po.completion}%</span>
                </div>
              </TableCell>
              <TableCell>
                {po.blockers || getTranslation("logistics.none", language)}
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityVariant(po.priority) as any}>
                  {getPriorityTranslation(po.priority)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
