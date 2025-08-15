
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { SupplierPerformanceDialog } from './SupplierPerformanceDialog';
import { useState } from 'react';

type Supplier = {
  id: string;
  name: string;
  reliability: number;
  lead_time_adherence: number;
  quality_score: number;
  cost_efficiency: number;
  sustainability_score: number;
  preferred_for_skus: string[];
  contact_info: {
    name: string;
    email: string;
    phone: string;
  };
};

// Mock data
const supplierData = [
  {
    id: '1',
    name: 'ABC Manufacturing',
    reliability: 92,
    lead_time_adherence: 88,
    quality_score: 95,
    cost_efficiency: 87,
    sustainability_score: 78,
    preferred_for_skus: ['SKU001', 'SKU002', 'SKU003'],
    contact_info: {
      name: 'John Smith',
      email: 'john@abcmfg.com',
      phone: '+1 555-123-4567',
    },
  },
  {
    id: '2',
    name: 'XYZ Distributors',
    reliability: 85,
    lead_time_adherence: 90,
    quality_score: 88,
    cost_efficiency: 92,
    sustainability_score: 75,
    preferred_for_skus: ['SKU004', 'SKU005'],
    contact_info: {
      name: 'Sarah Johnson',
      email: 'sarah@xyzdist.com',
      phone: '+1 555-987-6543',
    },
  },
  {
    id: '3',
    name: 'Global Supply Co.',
    reliability: 78,
    lead_time_adherence: 82,
    quality_score: 90,
    cost_efficiency: 95,
    sustainability_score: 65,
    preferred_for_skus: ['SKU006', 'SKU007', 'SKU008', 'SKU009'],
    contact_info: {
      name: 'Michael Chen',
      email: 'michael@globalsupply.com',
      phone: '+1 555-456-7890',
    },
  },
];

export const SupplierManagementTab = () => {
  const { language } = useLanguage();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [performanceDialogOpen, setPerformanceDialogOpen] = useState(false);

  // For demo purposes using mock data, but this would normally fetch from Supabase
  const { data: suppliers = supplierData, isLoading, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // This is commented out because we're using mock data for demo
      // const { data, error } = await supabase
      //   .from('suppliers')
      //   .select('*');
      
      // if (error) throw error;
      // return data as Supplier[];
      
      return supplierData;
    },
    enabled: false, // Disabled for demo, would be true in production
  });

  const performanceData = [
    {
      name: 'ABC Manufacturing',
      reliability: 92,
      leadTime: 88,
      quality: 95,
      cost: 87,
    },
    {
      name: 'XYZ Distributors',
      reliability: 85,
      leadTime: 90,
      quality: 88,
      cost: 92,
    },
    {
      name: 'Global Supply Co.',
      reliability: 78,
      leadTime: 82,
      quality: 90,
      cost: 95,
    },
  ];

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-blue-500">Good</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge className="bg-red-500">Poor</Badge>;
  };

  const handleOpenPerformance = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setPerformanceDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p>{getTranslation("inventory.loadingData", language)}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p>{getTranslation("inventory.errorLoading", language)}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {getTranslation("supplyPlanning.onTimeDelivery", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("supplyPlanning.supplierPerformance", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% {getTranslation("common.fromLastMonth", language)}
            </p>
            <Progress value={86} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {getTranslation("supplyPlanning.qualityCompliance", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("supplyPlanning.supplierQuality", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% {getTranslation("common.fromLastMonth", language)}
            </p>
            <Progress value={92} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {getTranslation("supplyPlanning.activeSuppliers", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("supplyPlanning.totalSuppliers", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              +1 {getTranslation("common.fromLastMonth", language)}
            </p>
            <Progress value={suppliers.length * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("supplyPlanning.supplierPerformanceComparison", language)}</CardTitle>
          <CardDescription>
            {getTranslation("supplyPlanning.supplierPerformanceDesc", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reliability" name={getTranslation("supplyPlanning.metrics.reliability", language)} fill="#3B82F6" />
                <Bar dataKey="leadTime" name={getTranslation("supplyPlanning.metrics.leadTime", language)} fill="#10B981" />
                <Bar dataKey="quality" name={getTranslation("supplyPlanning.metrics.quality", language)} fill="#F59E0B" />
                <Bar dataKey="cost" name={getTranslation("supplyPlanning.metrics.cost", language)} fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{getTranslation("supplyPlanning.supplierList", language)}</CardTitle>
          <CardDescription>
            {getTranslation("supplyPlanning.supplierListDesc", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{getTranslation("supplyPlanning.supplierName", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.reliability", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.leadTimeAdherence", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.qualityScore", language)}</TableHead>
                <TableHead>{getTranslation("supplyPlanning.costEfficiency", language)}</TableHead>
                <TableHead className="text-right">{getTranslation("inventory.actions", language)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {supplier.reliability}%
                      {getPerformanceBadge(supplier.reliability)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {supplier.lead_time_adherence}%
                      {getPerformanceBadge(supplier.lead_time_adherence)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {supplier.quality_score}%
                      {getPerformanceBadge(supplier.quality_score)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {supplier.cost_efficiency}%
                      {getPerformanceBadge(supplier.cost_efficiency)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenPerformance(supplier)}>
                        {getTranslation("supplyPlanning.viewPerformance", language)}
                      </Button>
                      <Button size="sm">
                        {getTranslation("supplyPlanning.contact", language)}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SupplierPerformanceDialog
        open={performanceDialogOpen}
        onOpenChange={setPerformanceDialogOpen}
        supplier={selectedSupplier}
      />
    </div>
  );
};
