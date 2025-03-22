
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface DDSOPTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const DDSOPTabs: React.FC<DDSOPTabsProps> = ({ activeTab, onTabChange }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="operational">
          {isArabic ? "التشغيلي" : "Operational"}
        </TabsTrigger>
        <TabsTrigger value="integration">
          {isArabic ? "التكامل مع S&OP" : "S&OP Integration"}
        </TabsTrigger>
        <TabsTrigger value="adaptive">
          {isArabic ? "التخطيط التكيفي" : "Adaptive Planning"}
        </TabsTrigger>
        <TabsTrigger value="collaboration">
          {isArabic ? "التنفيذ التعاوني" : "Collaborative Execution"}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
