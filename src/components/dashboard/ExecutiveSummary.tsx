import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation, toArabicNumerals } from '@/translations';
import { DollarSign, Users, ShoppingCart, BarChart } from 'lucide-react';

const ExecutiveSummary = () => {
  const { language } = useLanguage();

  const summaryData = [
    {
      title: 'totalRevenue',
      value: '$1.25M',
      icon: DollarSign,
      trend: '+12.5%',
    },
    {
      title: 'newCustomers',
      value: '450',
      icon: Users,
      trend: '+8.2%',
    },
    {
      title: 'averageOrderValue',
      value: '$275',
      icon: ShoppingCart,
      trend: '-3.5%',
    },
    {
      title: 'customerSatisfaction',
      value: '4.8/5',
      icon: BarChart,
      trend: '+1.2%',
    },
  ];

  const formatNumber = (value: string | number, language: 'en' | 'ar'): string => {
    if (typeof value === 'number') {
      return language === 'ar' ? toArabicNumerals(value.toString()) : value.toString();
    }
    return language === 'ar' ? toArabicNumerals(value) : value;
  };

  return (
    <Card className="p-4">
      <h4 className="font-semibold text-md mb-3">
        {getTranslation('dashboard.title', language)}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item) => (
          <div key={item.title} className="p-3 rounded-md shadow-sm border">
            <div className="flex items-center">
              {React.createElement(item.icon, { className: "h-5 w-5 mr-2 text-gray-500" })}
              <h5 className="font-semibold text-sm">
                {getTranslation(item.title, language)}
              </h5>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold">
                {formatNumber(item.value, language)}
              </p>
              <p className="text-xs text-gray-500">
                {item.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ExecutiveSummary;
