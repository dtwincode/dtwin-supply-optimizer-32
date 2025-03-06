
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem, PurchaseOrder } from "@/types/inventory";
import { createPurchaseOrder } from "@/services/inventoryService";
import { DataTable } from "@/components/ui/data-table";
import { PaginationState } from "@/types/inventory/databaseTypes";

interface InventoryDashboardProps {
  items: InventoryItem[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
  onPageChange: (page: number) => void;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  items,
  pagination,
  onPageChange
}) => {
  const { toast } = useToast();
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const handleCreatePO = async (item: InventoryItem) => {
    setLoadingItems(prev => ({ ...prev, [item.id]: true }));
    
    try {
      const order: Omit<PurchaseOrder, 'id'> = {
        poNumber: `PO-${Date.now().toString().slice(-6)}`,
        sku: item.sku,
        quantity: Math.max(item.redZoneSize || 100, 10),
        createdBy: 'system',
        status: 'pending',
        orderDate: new Date().toISOString()
      };
      
      const result = await createPurchaseOrder(order);
      
      toast({
        title: "Success",
        description: `Purchase order ${result.poNumber} created successfully`,
      });
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const columns = [
    {
      accessorKey: 'sku',
      header: 'SKU',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'currentStock',
      header: 'Current Stock',
    },
    {
      accessorKey: 'bufferPenetration',
      header: 'Buffer Penetration',
      cell: ({ row }: any) => {
        const value = row.original.bufferPenetration;
        if (value === undefined) return '-';
        return `${(value * 100).toFixed(1)}%`;
      }
    },
    {
      accessorKey: 'netFlowPosition',
      header: 'Net Flow Position',
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        const item = row.original;
        const isLoading = loadingItems[item.id] || false;
        
        return (
          <Button 
            variant="outline" 
            size="sm"
            disabled={isLoading}
            onClick={() => handleCreatePO(item)}
          >
            {isLoading ? 'Creating...' : 'Create PO'}
          </Button>
        );
      }
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Dashboard</CardTitle>
        <CardDescription>Monitor and manage your inventory items</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={items} 
          pagination={{
            pageSize: pagination.itemsPerPage,
            pageIndex: pagination.currentPage - 1,
            pageCount: Math.ceil(pagination.totalItems / pagination.itemsPerPage),
            onPageChange: (page) => onPageChange(page + 1)
          }}
        />
      </CardContent>
    </Card>
  );
};
