import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { CarbonFootprintTracker } from "@/components/logistics/sustainability/CarbonFootprintTracker";

export const SustainabilityTab = () => {
  const { language } = useLanguage();
  const t = (key: string) =>
    getTranslation(`logistics.${key}`, language) || key;

  return (
    <div className="p-4 space-y-6">
      <CarbonFootprintTracker />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              {t("sustainableRouting")}
            </h2>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
              <span className="text-muted-foreground">
                {t("ecoRoutingOptions")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              {t("sustainabilityReporting")}
            </h2>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
              <span className="text-muted-foreground">
                {t("environmentalReports")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
