
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

// Mock data for lead time history
const leadTimeHistory = [
  {
    month: 'Jan',
    average: 12,
    minimum: 8,
    maximum: 16,
  },
  {
    month: 'Feb',
    average: 14,
    minimum: 10,
    maximum: 18,
  },
  {
    month: 'Mar',
    average: 13,
    minimum: 9,
    maximum: 17,
  },
  {
    month: 'Apr',
    average: 15,
    minimum: 11,
    maximum: 19,
  },
  {
    month: 'May',
    average: 14,
    minimum: 10,
    maximum: 18,
  },
  {
    month: 'Jun',
    average: 11,
    minimum: 7,
    maximum: 15,
  },
];

// Mock data for SKUs and their lead times
const skuLeadTimes = [
  {
    sku: 'SKU001',
    name: 'Product A',
    supplier: 'ABC Manufacturing',
    leadTimeDays: 12,
    variability: 'Low',
    trend: 'decreasing',
    lastUpdated: '2023-06-15',
  },
  {
    sku: 'SKU002',
    name: 'Product B',
    supplier: 'XYZ Distributors',
    leadTimeDays: 18,
    variability: 'Medium',
    trend: 'stable',
    lastUpdated: '2023-06-10',
  },
  {
    sku: 'SKU003',
    name: 'Product C',
    supplier: 'Global Supply Co.',
    leadTimeDays: 24,
    variability: 'High',
    trend: 'increasing',
    lastUpdated: '2023-06-05',
  },
  {
    sku: 'SKU004',
    name: 'Product D',
    supplier: 'ABC Manufacturing',
    leadTimeDays: 10,
    variability: 'Low',
    trend: 'stable',
    lastUpdated: '2023-06-12',
  },
  {
    sku: 'SKU005',
    name: 'Product E',
    supplier: 'XYZ Distributors',
    leadTimeDays: 21,
    variability: 'High',
    trend: 'stable',
    lastUpdated: '2023-06-08',
  },
];

export const LeadTimeManagementTab = () => {
  const { language } = useLanguage();

  const getVariabilityBadge = (variability: string) => {
    switch (variability.toLowerCase()) {
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      default:
        return <Badge>{variability}</Badge>;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'decreasing':
        return <Badge className="bg-green-500">Decreasing</Badge>;
      case 'stable':
        return <Badge className="bg-blue-500">Stable</Badge>;
      case 'increasing':
        return <Badge className="bg-red-500">Increasing</Badge>;
      default:
        return <Badge>{trend}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {getTranslation("supplyPlanning.avgLeadTime", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("supplyPlanning.acrossAllSuppliers", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2 {getTranslation("supplyPlanning.days", language)}</div>
            <p className="text-xs text-muted-foreground">
              -1.3 {getTranslation("supplyPlanning.days", language)} {getTranslation("common.fromLastMonth", language)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {getTranslation("supplyPlanning.leadTimeVariability", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("supplyPlanning.standardDeviation", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">±3.5 {getTranslation("supplyPlanning.days", language)}</div>
            <p className="text-xs text-muted-foreground">
              -0.2 {getTranslation("supplyPlanning.days", language)} {getTranslation("common.fromLastMonth", language)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {getTranslation("supplyPlanning.leadTimeReliability", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("supplyPlanning.ordersOnTime", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              +3% {getTranslation("common.fromLastMonth", language)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("supplyPlanning.leadTimeTrends", language)}</CardTitle>
          <CardDescription>
            {getTranslation("supplyPlanning.sixMonthTrend", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={leadTimeHistory}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  name={getTranslation("supplyPlanning.avgLeadTime", language)} 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="minimum" 
                  name={getTranslation("supplyPlanning.minLeadTime", language)} 
                  stroke="#10B981" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="maximum" 
                  name={getTranslation("supplyPlanning.maxLeadTime", language)} 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("supplyPlanning.skuLeadTimes", language)}</CardTitle>
          <CardDescription>
            {getTranslation("supplyPlanning.skuLeadTimesDesc", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{getTranslation("inventory.sku", language)}</TableHead>
                <TableHead>{getTranslation("inventory.name", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.supplier", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.leadTimeDays", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.variability", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.trend", language)}</TableHead>
                <TableHead className="text-right">{getTranslation("inventory.actions", language)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skuLeadTimes.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.leadTimeDays} {getTranslation("supplyPlanning.days", language)}</TableCell>
                  <TableCell>{getVariabilityBadge(item.variability)}</TableCell>
                  <TableCell>{getTrendBadge(item.trend)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      {getTranslation("supplyPlanning.viewHistory", language)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("supplyPlanning.leadTimeOptimization", language)}</CardTitle>
          <CardDescription>
            {getTranslation("supplyPlanning.leadTimeOptimizationDesc", language)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-amber-800">
                  {getTranslation("supplyPlanning.riskAnalysis", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-800">
                  {getTranslation("supplyPlanning.riskAnalysisDesc", language)}
                </p>
                <div className="mt-4">
                  <Button variant="outline" className="border-amber-500 text-amber-700">
                    {getTranslation("supplyPlanning.runAnalysis", language)}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-emerald-800">
                  {getTranslation("supplyPlanning.leadTimeReduction", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-800">
                  {getTranslation("supplyPlanning.leadTimeReductionDesc", language)}
                </p>
                <div className="mt-4">
                  <Button variant="outline" className="border-emerald-500 text-emerald-700">
                    {getTranslation("supplyPlanning.generateRecommendations", language)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {getTranslation("supplyPlanning.leadTimeCalculations", language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {getTranslation("supplyPlanning.leadTimeCalculationsDesc", language)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">{getTranslation("supplyPlanning.leadTimeCategories", language)}</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Short: ≤ 7 days</li>
                    <li>Medium: 8-14 days</li>
                    <li>Long: > 14 days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">{getTranslation("supplyPlanning.variabilityLevels", language)}</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Low: ≤ 10% deviation</li>
                    <li>Medium: 11-20% deviation</li>
                    <li>High: > 20% deviation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">{getTranslation("supplyPlanning.ddmrpImpact", language)}</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Buffer sizing</li>
                    <li>Red zone calculation</li>
                    <li>Order generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
