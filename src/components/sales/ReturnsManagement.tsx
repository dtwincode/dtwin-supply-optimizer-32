
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import type { ProductReturn } from "@/types/sales";

const mockReturns: ProductReturn[] = [
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
    status: "processed",
    impact: {
      inventory: 5,
      forecast: -2
    }
  }
];

export const ReturnsManagement = () => {
  const [returns] = useState<ProductReturn[]>(mockReturns);
  const { language } = useLanguage();

  const getStatusColor = (status: ProductReturn['status']) => {
    switch (status) {
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'approved': return "bg-green-100 text-green-800";
      case 'rejected': return "bg-red-100 text-red-800";
      case 'processed': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTranslation = (status: ProductReturn['status']) => {
    return getTranslation(`sales.${status}`, language);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {getTranslation('sales.returns', language)}
        </CardTitle>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
