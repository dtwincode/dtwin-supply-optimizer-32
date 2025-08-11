
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import type { ProductReturn } from "@/types/sales";
import { calculateReturnImpact } from "@/utils/salesUtils";
import { useForecastData } from "@/hooks/useForecastData";
import { ReturnEntryDialog } from "./ReturnEntryDialog";
import { Button } from "@/components/ui/button";
import { ReturnDetailsPanel } from "./ReturnDetailsPanel";
import { ReturnInsights } from "./ReturnInsights";
import { CalendarClock, BarChart3, ArrowUpDown, Filter, ChevronDown, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Enhanced mock data with more realistic scenarios
const mockReturns: Omit<ProductReturn, 'impact'>[] = [
  {
    id: "1",
    productSku: "SKU001",
    productName: "Premium Smartphone X1",
    quantity: 5,
    returnDate: "2024-03-20",
    reason: "Damaged in transit",
    condition: "damaged",
    location: {
      region: "Central Region",
      city: "Riyadh",
      warehouse: "RUH-DC1"
    },
    customer: {
      id: "CUST123",
      name: "Al Riyadh Electronics",
      segment: "Retail"
    },
    status: "analyzed",
    priorityLevel: "medium",
    tags: ["Electronics", "Q1", "Transit Damage"],
    relatedOrders: ["ORD-8721"],
    forecastUpdated: true,
    analysisNotes: "Pattern of transit damage for this product line. Consider packaging review."
  },
  {
    id: "2",
    productSku: "SKU002",
    productName: "Wireless Headphones Pro",
    quantity: 3,
    returnDate: "2024-03-18",
    reason: "Quality defect",
    condition: "damaged",
    location: {
      region: "Western Region",
      city: "Jeddah",
      warehouse: "JED-DC2"
    },
    customer: {
      id: "CUST456",
      name: "Media Market",
      segment: "Wholesale"
    },
    status: "recorded",
    priorityLevel: "high",
    tags: ["Electronics", "Quality Issue"],
    relatedOrders: ["ORD-5632"],
    forecastUpdated: false,
    analysisNotes: ""
  },
  {
    id: "3",
    productSku: "SKU003",
    productName: "Ultra HD Smart TV 55\"",
    quantity: 2,
    returnDate: "2024-03-22",
    reason: "Wrong specifications ordered",
    condition: "new",
    location: {
      region: "Eastern Region",
      city: "Dammam",
      warehouse: "DMM-DC1"
    },
    customer: {
      id: "CUST789",
      name: "Eastern Electronics",
      segment: "Retail"
    },
    status: "processing",
    priorityLevel: "low",
    tags: ["Electronics", "Order Error"],
    relatedOrders: ["ORD-9235"],
    forecastUpdated: false,
    analysisNotes: "Customer ordered wrong model. No product quality issues."
  }
];

export const ReturnsManagement = () => {
  const [returns, setReturns] = useState<ProductReturn[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<ProductReturn | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const { language } = useLanguage();
  
  // Reference to the forecast data hook to make the component ready for real integration
  const { filteredData: forecastData } = useForecastData(
    "all", // region
    "all", // city
    "all", // channel
    "all", // warehouse
    "", // searchQuery
    "2024-01-01", // fromDate
    "2024-12-31", // toDate
    "moving-avg", // selectedModel
    "all", // category
    "all", // subcategory
    "all" // sku
  );

  // Calculate impact when component mounts
  useEffect(() => {
    // Process returns and calculate impact
    const processedReturns = mockReturns.map(returnItem => {
      // Calculate impact using our utility function
      const impact = calculateReturnImpact({
        quantity: returnItem.quantity,
        condition: returnItem.condition,
        reason: returnItem.reason
      });
      
      // For analyzed returns, we might add more detailed impact data
      if (returnItem.status === "analyzed") {
        impact.revenue = -(returnItem.quantity * 450); // Mock revenue impact
        impact.nextPeriodAdjustment = returnItem.condition === "new" ? 0 : -2; // Percentage adjustment for next period
      }
      
      return {
        ...returnItem,
        impact
      };
    });
    
    setReturns(processedReturns);
    
    // In a real app, we would use a useEffect dependency on a data source
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: ProductReturn['status']) => {
    switch (status) {
      case 'recorded': return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'processing': return "bg-blue-100 text-blue-800 border-blue-300";
      case 'analyzed': return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: ProductReturn['priorityLevel']) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-800 border-red-300";
      case 'medium': return "bg-orange-100 text-orange-800 border-orange-300";
      case 'low': return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusTranslation = (status: ProductReturn['status']) => {
    return getTranslation(`sales.${status}`, language);
  };

  const handleNewReturn = (returnData: ProductReturn) => {
    // New returns are automatically in 'recorded' status
    const newReturn = {
      ...returnData,
      status: 'recorded' as ProductReturn['status'],
      priorityLevel: 'medium' as 'low' | 'medium' | 'high',
      tags: []
    };
    
    setReturns(prev => [newReturn, ...prev]);
    // In a real application, this would also save to a database
  };

  const handleUpdateForecast = (id: string) => {
    // Mark as analyzed and update forecasts based on return data
    setReturns(prev => prev.map(returnItem => 
      returnItem.id === id 
        ? { 
            ...returnItem, 
            status: 'analyzed' as ProductReturn['status'],
            forecastUpdated: true,
            analysisNotes: "Forecast updated based on return data. Adjustments applied to inventory and future forecast periods."
          }
        : returnItem
    ));
    // In a real application, this would trigger a forecast update
  };

  const handleStartAnalysis = (id: string) => {
    // Move to processing status
    setReturns(prev => prev.map(returnItem => 
      returnItem.id === id 
        ? { ...returnItem, status: 'processing' as ProductReturn['status'] }
        : returnItem
    ));
  };

  const handleViewDetails = (returnItem: ProductReturn) => {
    setSelectedReturn(returnItem);
    setShowDetailsPanel(true);
  };

  const filteredReturns = returns.filter(returnItem => {
    // Filter by tab
    if (selectedTab !== "all" && returnItem.status !== selectedTab) {
      return false;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        returnItem.productSku.toLowerCase().includes(query) ||
        returnItem.productName?.toLowerCase().includes(query) ||
        returnItem.reason.toLowerCase().includes(query) ||
        returnItem.location.region.toLowerCase().includes(query) ||
        returnItem.customer?.name?.toLowerCase().includes(query) ||
        returnItem.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const returnStats = {
    total: returns.length,
    recorded: returns.filter(r => r.status === 'recorded').length,
    processing: returns.filter(r => r.status === 'processing').length,
    analyzed: returns.filter(r => r.status === 'analyzed').length,
    highPriority: returns.filter(r => r.priorityLevel === 'high').length,
  };

  return (
    <div className="space-y-6">
      {showDetailsPanel && selectedReturn && (
        <ReturnDetailsPanel 
          returnData={selectedReturn} 
          onClose={() => setShowDetailsPanel(false)}
          onUpdateForecast={(id) => {
            handleUpdateForecast(id);
            setShowDetailsPanel(false);
          }}
        />
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">
                {getTranslation('sales.returns', language)}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'تحليل وإدارة المرتجعات وتأثيرها على التنبؤ'
                  : 'Analyze and manage returns and their impact on forecasting'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Input
                  className="pl-9"
                  placeholder={getTranslation('sales.searchReturns', language) || "Search returns..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              <ReturnEntryDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleNewReturn}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="border-b px-6 py-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  All ({returnStats.total})
                </TabsTrigger>
                <TabsTrigger value="recorded" className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700">
                  Recorded ({returnStats.recorded})
                </TabsTrigger>
                <TabsTrigger value="processing" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Processing ({returnStats.processing})
                </TabsTrigger>
                <TabsTrigger value="analyzed" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                  Analyzed ({returnStats.analyzed})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>{getTranslation('sales.sku', language)}</TableHead>
                <TableHead>{getTranslation('sales.productName', language) || "Product Name"}</TableHead>
                <TableHead>{getTranslation('sales.quantity', language)}</TableHead>
                <TableHead>{getTranslation('sales.returnDate', language)}</TableHead>
                <TableHead>{getTranslation('sales.reason', language)}</TableHead>
                <TableHead>{getTranslation('sales.status', language)}</TableHead>
                <TableHead>{getTranslation('sales.impact', language)}</TableHead>
                <TableHead className="text-right">{getTranslation('sales.actions', language)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    {language === 'ar' 
                      ? 'لا توجد مرتجعات مطابقة للبحث'
                      : 'No returns found matching your search criteria'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReturns.map((returnItem) => (
                  <TableRow key={returnItem.id} className="group hover:bg-gray-50">
                    <TableCell className="font-medium">{returnItem.productSku}</TableCell>
                    <TableCell>{returnItem.productName || "-"}</TableCell>
                    <TableCell>{returnItem.quantity}</TableCell>
                    <TableCell>{new Date(returnItem.returnDate).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={returnItem.reason}>
                      {returnItem.reason}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(returnItem.status)}>
                        {getStatusTranslation(returnItem.status)}
                      </Badge>
                      {returnItem.priorityLevel && (
                        <Badge className={`ml-2 text-xs ${getPriorityColor(returnItem.priorityLevel)}`}>
                          {returnItem.priorityLevel}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {getTranslation('sales.inventory', language)}: {returnItem.impact.inventory}
                        </div>
                        <div className="text-sm">
                          {getTranslation('sales.forecast', language)}: {returnItem.impact.forecast}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{getTranslation('sales.actions', language)}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(returnItem)}>
                            <FileText className="mr-2 h-4 w-4" />
                            {getTranslation('sales.viewDetails', language) || "View Details"}
                          </DropdownMenuItem>
                          {returnItem.status === 'recorded' && (
                            <DropdownMenuItem onClick={() => handleStartAnalysis(returnItem.id)}>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              {getTranslation('sales.startAnalysis', language) || "Start Analysis"}
                            </DropdownMenuItem>
                          )}
                          {returnItem.status === 'processing' && (
                            <DropdownMenuItem onClick={() => handleUpdateForecast(returnItem.id)}>
                              <CalendarClock className="mr-2 h-4 w-4" />
                              {getTranslation('sales.updateForecast', language) || "Update Forecast"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <ReturnInsights returns={returns} />
    </div>
  );
};
