
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import type { ProductReturn } from "@/types/sales";
import { calculateReturnImpact } from "@/utils/salesUtils";
import { useForecastData } from "@/hooks/useForecastData";
import { ReturnEntryDialog } from "./ReturnEntryDialog";
import { Button } from "@/components/ui/button";

// Enhanced mock data with more realistic scenarios
const mockReturns: Omit<ProductReturn, 'impact'>[] = [
  {
    id: "1",
    productSku: "SKU001",
    quantity: 5,
    returnDate: "2024-03-20",
    reason: "Damaged in transit",
    condition: "damaged",
    location: {
      region: "Central Region",
      city: "Riyadh"
    },
    status: "processed"
  },
  {
    id: "2",
    productSku: "SKU002",
    quantity: 3,
    returnDate: "2024-03-18",
    reason: "Quality defect",
    condition: "damaged",
    location: {
      region: "Western Region",
      city: "Jeddah"
    },
    status: "recorded"
  },
  {
    id: "3",
    productSku: "SKU003",
    quantity: 2,
    returnDate: "2024-03-22",
    reason: "Wrong size ordered",
    condition: "new",
    location: {
      region: "Eastern Region",
      city: "Dammam"
    },
    status: "processed"
  }
];

export const ReturnsManagement = () => {
  const [returns, setReturns] = useState<ProductReturn[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      case 'recorded': return "bg-yellow-100 text-yellow-800";
      case 'processed': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTranslation = (status: ProductReturn['status']) => {
    return getTranslation(`sales.${status}`, language);
  };

  const handleNewReturn = (returnData: ProductReturn) => {
    // New returns are automatically in 'recorded' status
    const newReturn = {
      ...returnData,
      status: 'recorded' as ProductReturn['status']
    };
    
    setReturns(prev => [newReturn, ...prev]);
    // In a real application, this would also save to a database
  };

  const handleUpdateForecast = (id: string) => {
    // Mark as analyzed and update forecasts based on return data
    setReturns(prev => prev.map(returnItem => 
      returnItem.id === id 
        ? { ...returnItem, status: 'processed' as ProductReturn['status'] }
        : returnItem
    ));
    // In a real application, this would trigger a forecast update
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {getTranslation('sales.returns', language)}
        </CardTitle>
        <ReturnEntryDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleNewReturn}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation('sales.sku', language)}</TableHead>
              <TableHead>{getTranslation('sales.quantity', language)}</TableHead>
              <TableHead>{getTranslation('sales.returnDate', language)}</TableHead>
              <TableHead>{getTranslation('sales.reason', language)}</TableHead>
              <TableHead>{getTranslation('sales.status', language)}</TableHead>
              <TableHead>{getTranslation('sales.impact', language)}</TableHead>
              <TableHead>{getTranslation('sales.actions', language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returns.map((returnItem) => (
              <TableRow key={returnItem.id}>
                <TableCell>{returnItem.productSku}</TableCell>
                <TableCell>{returnItem.quantity}</TableCell>
                <TableCell>{returnItem.returnDate}</TableCell>
                <TableCell>{returnItem.reason}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(returnItem.status)}>
                    {getStatusTranslation(returnItem.status)}
                  </Badge>
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
                <TableCell>
                  <div className="flex space-x-2">
                    {returnItem.status === 'recorded' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleUpdateForecast(returnItem.id)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        {getTranslation('sales.updateForecast', language) || "Update Forecast"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
