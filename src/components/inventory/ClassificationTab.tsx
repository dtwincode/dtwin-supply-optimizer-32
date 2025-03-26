
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { SKUClassifications } from "./SKUClassifications";
import { ClassificationManager } from "./ClassificationManager";
import { useEffect, useState } from "react";
import { SKUClassification } from "./types";

export function ClassificationTab() {
  const { language } = useLanguage();
  const [classifications, setClassifications] = useState<SKUClassification[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setClassifications([
      {
        sku: "SKU001",
        classification: {
          leadTimeCategory: "long",
          variabilityLevel: "medium",
          criticality: "high",
          score: 85
        },
        lastUpdated: new Date().toISOString()
      },
      {
        sku: "SKU002",
        classification: {
          leadTimeCategory: "medium",
          variabilityLevel: "low",
          criticality: "medium",
          score: 65
        },
        lastUpdated: new Date().toISOString()
      },
      {
        sku: "SKU003",
        classification: {
          leadTimeCategory: "short",
          variabilityLevel: "high",
          criticality: "low",
          score: 45
        },
        lastUpdated: new Date().toISOString()
      }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation("navigationItems.inventoryClassification", language) || "SKU Classification"}
          </CardTitle>
          <CardDescription>
            {getTranslation("common.inventory.classification.description", language) || "Classify SKUs based on lead time, variability, and criticality"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SKUClassifications classifications={classifications} />
        </CardContent>
      </Card>
      
      <ClassificationManager />
    </div>
  );
}
