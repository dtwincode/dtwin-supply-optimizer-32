
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const SalesForecastIntegration = () => {
  const { language } = useLanguage();
  const [selectedView, setSelectedView] = useState<"product" | "region">("product");
  const [selectedCategory, setSelectedCategory] = useState<string>("electronics");

  const categoryOptions = [
    { value: "electronics", label: language === 'ar' ? 'الإلكترونيات' : 'Electronics' },
    { value: "furniture", label: language === 'ar' ? 'الأثاث' : 'Furniture' },
    { value: "clothing", label: language === 'ar' ? 'الملابس' : 'Clothing' }
  ];

  const productData = [
    { name: "Smartphones", actual: 4200, forecast: 4500, plan: 4600, variance: -8.7 },
    { name: "Laptops", actual: 3100, forecast: 3250, plan: 3000, variance: 3.3 },
    { name: "Tablets", actual: 2700, forecast: 2600, plan: 2800, variance: -3.6 },
    { name: "Headphones", actual: 1800, forecast: 1750, plan: 1700, variance: 5.9 },
    { name: "Smartwatches", actual: 1200, forecast: 1300, plan: 1250, variance: -4.0 },
  ];

  const regionData = [
    { name: "North", actual: 5500, forecast: 5700, plan: 5600, variance: -1.8 },
    { name: "South", actual: 4800, forecast: 4600, plan: 4900, variance: -2.0 },
    { name: "East", actual: 3600, forecast: 3500, plan: 3550, variance: 1.4 },
    { name: "West", actual: 4100, forecast: 4200, plan: 4000, variance: 2.5 },
    { name: "Central", actual: 3200, forecast: 3300, plan: 3400, variance: -5.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs 
          defaultValue="product" 
          value={selectedView}
          onValueChange={(value) => setSelectedView(value as "product" | "region")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product">
              {language === 'ar' ? 'حسب المنتج' : 'By Product'}
            </TabsTrigger>
            <TabsTrigger value="region">
              {language === 'ar' ? 'حسب المنطقة' : 'By Region'}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full md:w-auto">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select Category'} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={selectedView === "product" ? productData : regionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="actual" 
              name={language === 'ar' ? 'الفعلي' : 'Actual'} 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="forecast" 
              name={language === 'ar' ? 'التنبؤ' : 'Forecast'} 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="plan" 
              name={language === 'ar' ? 'الخطة' : 'Plan'} 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {selectedView === "product" ? (language === 'ar' ? 'المنتج' : 'Product') : (language === 'ar' ? 'المنطقة' : 'Region')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'ar' ? 'الفعلي' : 'Actual'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'ar' ? 'التنبؤ' : 'Forecast'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'ar' ? 'الخطة' : 'Plan'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'ar' ? 'التباين (٪)' : 'Variance (%)'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(selectedView === "product" ? productData : regionData).map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.actual.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.forecast.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.plan.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={item.variance >= 0 ? "success" : "destructive"} className="text-xs">
                    {item.variance >= 0 ? '+' : ''}{item.variance}%
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
