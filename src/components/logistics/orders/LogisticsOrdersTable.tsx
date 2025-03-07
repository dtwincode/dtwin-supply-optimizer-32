
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

// Sample data for the orders table
const ordersData = [
  {
    id: 'ORD-20240315-001',
    orderRef: 'REF-2024-001',
    carrier: 'FastLogistics',
    trackingNumber: 'TRK1234567890',
    status: 'in-transit',
    lastUpdated: '2024-03-17 14:30'
  },
  {
    id: 'ORD-20240314-002',
    orderRef: 'REF-2024-002',
    carrier: 'SpeedShippers',
    trackingNumber: 'TRK9876543210',
    status: 'delivered',
    lastUpdated: '2024-03-16 09:15'
  },
  {
    id: 'ORD-20240313-003',
    orderRef: 'REF-2024-003',
    carrier: 'GlobalTransport',
    trackingNumber: 'TRK5678901234',
    status: 'processing',
    lastUpdated: '2024-03-15 11:45'
  },
  {
    id: 'ORD-20240312-004',
    orderRef: 'REF-2024-004',
    carrier: 'RapidFreight',
    trackingNumber: 'TRK3456789012',
    status: 'out-for-delivery',
    lastUpdated: '2024-03-14 16:00'
  }
];

export const LogisticsOrdersTable = () => {
  const { language } = useLanguage();
  
  const getStatusTranslation = (status: string) => {
    const statusMap: Record<string, string> = {
      'in-transit': getTranslation('common.logistics.inTransit', language),
      'delivered': getTranslation('common.logistics.delivered', language),
      'processing': getTranslation('common.logistics.processing', language),
      'out-for-delivery': getTranslation('common.logistics.outForDelivery', language)
    };
    
    return statusMap[status] || status;
  };

  const getStatusVariant = (status: string) => {
    const variantMap: Record<string, string> = {
      'in-transit': 'default',
      'delivered': 'success',
      'processing': 'secondary',
      'out-for-delivery': 'warning'
    };
    
    return variantMap[status] || 'default';
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{getTranslation('common.logistics.orderRef', language)}</TableHead>
            <TableHead>{getTranslation('common.logistics.carrier', language)}</TableHead>
            <TableHead>{getTranslation('common.logistics.trackingNumber', language)}</TableHead>
            <TableHead>{getTranslation('common.logistics.statusLabel', language)}</TableHead>
            <TableHead>{getTranslation('common.logistics.lastUpdated', language)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersData.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderRef}</TableCell>
              <TableCell>{order.carrier}</TableCell>
              <TableCell>{order.trackingNumber}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status) as any}>
                  {getStatusTranslation(order.status)}
                </Badge>
              </TableCell>
              <TableCell>{order.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
