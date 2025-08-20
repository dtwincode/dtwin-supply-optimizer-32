import React from "react";
import { Layers, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { DDOMOperationalDashboard } from "@/components/logistics/ddom/DDOMOperationalDashboard";
import { DDOMCollaborativeExecution } from "@/components/logistics/ddom/DDOMCollaborativeExecution";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const DDOMTab = () => {
  const { language } = useLanguage();
  const t = (key: string) =>
    getTranslation(`logistics.ddom.${key}`, language) || key;
  const commonT = (key: string) =>
    getTranslation(`logistics.${key}`, language) || key;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Layers className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t("operationalModel")}</h2>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 h-8">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-medium">{commonT("ddsopCompliance")}</span>
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link to="/ddsop" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>
                {language === "en"
                  ? "Go to DDS&OP Module"
                  : "الانتقال إلى وحدة DDS&OP"}
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <DDOMOperationalDashboard />

      <div className="grid grid-cols-1 gap-6">
        <DDOMCollaborativeExecution />
        <div className="border border-dashed rounded-md p-6 bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              {language === "en"
                ? "Advanced DDOM features are now available in the DDS&OP module"
                : "الميزات المتقدمة لنموذج التشغيل المدفوع بالطلب متوفرة الآن في وحدة DDS&OP"}
            </p>
            <Button variant="default" asChild>
              <Link to="/ddsop">
                {language === "en" ? "Open DDS&OP Module" : "فتح وحدة DDS&OP"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
