
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { DDSOPHeader } from "@/components/ddsop/DDSOPHeader";
import { DDSOPTabs } from "@/components/ddsop/DDSOPTabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIndustry } from "@/contexts/IndustryContext";
import { getTranslation } from "@/translations";
import { PharmacyDDSOP } from "@/components/ddsop/PharmacyDDSOP";

const DDSOP = () => {
  const { language } = useLanguage();
  const { selectedIndustry } = useIndustry();
  const [activeTab, setActiveTab] = React.useState("operational");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-6 pt-6">
        <DDSOPHeader />
        <DDSOPTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        {selectedIndustry === 'pharmacy' && <PharmacyDDSOP />}
      </div>
    </DashboardLayout>
  );
};

export default DDSOP;
