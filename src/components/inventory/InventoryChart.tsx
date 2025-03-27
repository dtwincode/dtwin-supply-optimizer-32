import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Scatter, Cell } from 'recharts';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryItem } from "@/types/inventory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronDown, BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart, Sliders } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InventoryChartProps {
  data: InventoryItem[];
}

type ChartType = 'bar' | 'line' | 'area' | 'composed';
type DDMRPMetricView = 'bufferZones' | 'netFlow' | 'aduTrends' | 'bufferPenetration';

export const InventoryChart = ({ data }: InventoryChartProps) => {
  const { language } = useLanguage();
  const { t } = getTranslation();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
  const [showBufferExplanation, setShowBufferExplanation] = useState(false);
  const [metricView, setMetricView] = useState<DDMRPMetricView>('bufferZones');
  const [dataLimit, setDataLimit] = useState<number>(10);
  const [showThresholdLines, setShowThresholdLines] = useState(false);
  const [normalizeData, setNormalizeData] = useState(false);
  
  const getFilteredData = () => {
    const limitedData = data.slice(0, dataLimit);
    
    if (normalizeData) {
      return limitedData.map(item => {
        const total = (item.redZoneSize || 0) + (item.yellowZoneSize || 0) + (item.greenZoneSize || 0);
        return {
          name: item.name,
          red: total > 0 ? Math.round(((item.redZoneSize || 0) / total) * 100) : 0,
          yellow: total > 0 ? Math.round(((item.yellowZoneSize || 0) / total) * 100) : 0,
          green: total > 0 ? Math.round(((item.greenZoneSize || 0) / total) * 100) : 0,
          currentStock: total > 0 ? Math.round(((item.currentStock) / total) * 100) : 0,
          bufferPenetration: item.bufferPenetration || 0,
          adu: item.adu || 0,
          netFlow: item.netFlowPosition || 0,
          sku: item.sku,
          stockToZero: +(item.currentStock <= 0)
        };
      });
    }
    
    return limitedData.map(item => ({
      name: item.name,
      red: item.redZoneSize || 0,
      yellow: item.yellowZoneSize || 0,
      green: item.greenZoneSize || 0,
      currentStock: item.currentStock,
      bufferPenetration: item.bufferPenetration || 0,
      adu: item.adu || 0,
      netFlow: item.netFlowPosition || 0,
      sku: item.sku,
      stockToZero: +(item.currentStock <= 0),
      total: (item.redZoneSize || 0) + (item.yellowZoneSize || 0) + (item.greenZoneSize || 0)
    }));
  };

  const chartData = useMemo(() => getFilteredData(), [data, dataLimit, normalizeData]);
  
  const totalOrderToZero = useMemo(() => chartData.filter(item => item.stockToZero > 0).length, [chartData]);
  
  const averageBufferPenetration = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + (item.bufferPenetration || 0), 0);
    return chartData.length > 0 ? Math.round(total / chartData.length) : 0;
  }, [chartData]);

  const commonProps = {
    data: chartData,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  const renderMetricView = () => {
    switch(metricView) {
      case 'bufferZones':
        return renderBufferZonesChart();
      case 'netFlow':
        return renderNetFlowChart();
      case 'aduTrends':
        return renderADUTrendsChart();
      case 'bufferPenetration':
        return renderBufferPenetrationChart();
      default:
        return renderBufferZonesChart();
    }
  };

  const renderBufferZonesChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={customTooltip} />
            <Legend />
            <Line type="monotone" dataKey="green" stroke="#10B981" name={getTranslation('common.zones.green', language)} />
            <Line type="monotone" dataKey="yellow" stroke="#F59E0B" name={getTranslation('common.zones.yellow', language)} />
            <Line type="monotone" dataKey="red" stroke="#EF4444" name={getTranslation('common.zones.red', language)} />
            <Line type="monotone" dataKey="currentStock" stroke="#6B7280" name={getTranslation('common.zones.inventory', language)} />
            {showThresholdLines && <Line type="monotone" dataKey="total" stroke="#000000" strokeDasharray="5 5" name="TOG (Top of Green)" />}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={customTooltip} />
            <Legend />
            <Area type="monotone" dataKey="green" stackId="1" fill="#10B981" name={getTranslation('common.zones.green', language)} />
            <Area type="monotone" dataKey="yellow" stackId="1" fill="#F59E0B" name={getTranslation('common.zones.yellow', language)} />
            <Area type="monotone" dataKey="red" stackId="1" fill="#EF4444" name={getTranslation('common.zones.red', language)} />
            <Area type="monotone" dataKey="currentStock" fill="#6B7280" name={getTranslation('common.zones.inventory', language)} />
          </AreaChart>
        );
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="green" stackId="buffer" fill="#10B981" name={getTranslation('common.zones.green', language)} />
            <Bar dataKey="yellow" stackId="buffer" fill="#F59E0B" name={getTranslation('common.zones.yellow', language)} />
            <Bar dataKey="red" stackId="buffer" fill="#EF4444" name={getTranslation('common.zones.red', language)} />
            <Line type="monotone" dataKey="currentStock" stroke="#6B7280" strokeWidth={2} name={getTranslation('common.zones.inventory', language)} />
            {showThresholdLines && <Line type="monotone" dataKey="total" stroke="#000000" strokeDasharray="5 5" name="TOG (Top of Green)" />}
          </ComposedChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="green" stackId="buffer" fill="#10B981" name={getTranslation('common.zones.green', language)} />
            <Bar dataKey="yellow" stackId="buffer" fill="#F59E0B" name={getTranslation('common.zones.yellow', language)} />
            <Bar dataKey="red" stackId="buffer" fill="#EF4444" name={getTranslation('common.zones.red', language)} />
            <Bar dataKey="currentStock" fill="#6B7280" name={getTranslation('common.zones.inventory', language)} />
          </BarChart>
        );
    }
  };

  const renderNetFlowChart = () => {
    return (
      <ComposedChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="onHand" fill="#10B981" name="On Hand" />
        <Bar dataKey="onOrder" fill="#F59E0B" name="On Order" />
        <Bar dataKey="qualifiedDemand" fill="#EF4444" name="Qualified Demand" />
        <Line type="monotone" dataKey="netFlow" stroke="#3B82F6" strokeWidth={2} name="Net Flow Position" />
      </ComposedChart>
    );
  };

  const renderADUTrendsChart = () => {
    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="adu" stroke="#3B82F6" name="Average Daily Usage (ADU)" />
      </LineChart>
    );
  };

  const renderBufferPenetrationChart = () => {
    const getBarColor = (value: number) => {
      if (value >= 80) return '#EF4444';
      if (value >= 40) return '#F59E0B';
      return '#10B981';
    };

    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="bufferPenetration" name="Buffer Penetration %">
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getBarColor(entry.bufferPenetration || 0)}
            />
          ))}
        </Bar>
      </BarChart>
    );
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value} {normalizeData ? '%' : ''}
            </p>
          ))}
          {metricView === 'bufferZones' && payload.find((p: any) => p.dataKey === 'currentStock') && (
            <div className="mt-2 pt-2 border-t text-xs">
              {normalizeData ? 'Normalized as percentage of buffer size' : 'Absolute values shown'}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {t("common.inventory.bufferProfile")}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBufferExplanation(!showBufferExplanation)}
            >
              <Sliders className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'إعدادات الرسم البياني' : 'Chart Settings'}
            </Button>
          </div>
        </div>

        {showBufferExplanation && (
          <Card className="p-4 bg-slate-50 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1.5 text-xs">{language === 'ar' ? 'نوع الرسم البياني' : 'Chart Type'}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <Toggle 
                      variant="outline" 
                      size="sm"
                      pressed={chartType === 'bar'} 
                      onClick={() => setChartType('bar')}
                      aria-label="Bar Chart"
                      className="text-xs py-1 h-7"
                    >
                      <BarChartIcon className="h-3 w-3 mr-1" />
                      Bar
                    </Toggle>
                    <Toggle 
                      variant="outline"
                      size="sm"
                      pressed={chartType === 'line'} 
                      onClick={() => setChartType('line')}
                      aria-label="Line Chart"
                      className="text-xs py-1 h-7"
                    >
                      <LineChartIcon className="h-3 w-3 mr-1" />
                      Line
                    </Toggle>
                    <Toggle 
                      variant="outline"
                      size="sm"
                      pressed={chartType === 'area'} 
                      onClick={() => setChartType('area')}
                      aria-label="Area Chart"
                      className="text-xs py-1 h-7"
                    >
                      <LineChartIcon className="h-3 w-3 mr-1" />
                      Area
                    </Toggle>
                    <Toggle 
                      variant="outline"
                      size="sm"
                      pressed={chartType === 'composed'} 
                      onClick={() => setChartType('composed')}
                      aria-label="Composed Chart"
                      className="text-xs py-1 h-7"
                    >
                      <PieChart className="h-3 w-3 mr-1" />
                      Composed
                    </Toggle>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1.5 text-xs">{language === 'ar' ? 'عرض المقاييس' : 'Metric View'}</h4>
                  <Tabs defaultValue={metricView} onValueChange={(value) => setMetricView(value as DDMRPMetricView)} className="w-full">
                    <TabsList className="w-full grid grid-cols-4 h-7">
                      <TabsTrigger value="bufferZones" className="text-xs py-0">Buffer</TabsTrigger>
                      <TabsTrigger value="netFlow" className="text-xs py-0">Net Flow</TabsTrigger>
                      <TabsTrigger value="aduTrends" className="text-xs py-0">ADU</TabsTrigger>
                      <TabsTrigger value="bufferPenetration" className="text-xs py-0">Penetration</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <h4 className="font-medium mb-1.5 text-xs">{language === 'ar' ? 'حد البيانات' : 'Data Limit'}</h4>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={5} 
                      max={50} 
                      step={5} 
                      value={[dataLimit]} 
                      onValueChange={(value) => setDataLimit(value[0])} 
                      className="w-[60%]"
                    />
                    <span className="w-10 text-center text-xs">{dataLimit}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs">{language === 'ar' ? 'عرض بيانات موحدة (%)' : 'Show Normalized Data (%)'}</span>
                  <Switch 
                    checked={normalizeData} 
                    onCheckedChange={setNormalizeData}
                    className="scale-75" 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs">{language === 'ar' ? 'عرض خطوط العتبة' : 'Show Threshold Lines'}</span>
                  <Switch 
                    checked={showThresholdLines} 
                    onCheckedChange={setShowThresholdLines}
                    className="scale-75"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-[130px] justify-start text-left font-normal text-xs",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {fromDate ? format(fromDate, "MMM dd, yy") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={(date) => date && setFromDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-[130px] justify-start text-left font-normal text-xs",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {toDate ? format(toDate, "MMM dd, yy") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={(date) => date && setToDate(date)}
                        initialFocus
                        fromDate={fromDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-white p-2 border rounded-md">
                  <div className="text-xs font-medium text-gray-500">Items at Zero Stock</div>
                  <div className="text-xl font-bold">{totalOrderToZero}</div>
                </div>
                <div className="bg-white p-2 border rounded-md">
                  <div className="text-xs font-medium text-gray-500">Avg. Buffer Penetration</div>
                  <div className="text-xl font-bold">{averageBufferPenetration}%</div>
                </div>
                <div className="bg-white p-2 border rounded-md">
                  <div className="text-xs font-medium text-gray-500">Items Shown</div>
                  <div className="text-xl font-bold">{chartData.length} <span className="text-xs text-gray-500">/ {data.length}</span></div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderMetricView()}
          </ResponsiveContainer>
        </div>

        {metricView === 'bufferZones' && (
          <div className="grid grid-cols-3 gap-4 text-sm mt-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span>Red Zone: Safety stock for lead time variability</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
              <span>Yellow Zone: Cycle stock for lead time</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span>Green Zone: Order cycle protection</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
