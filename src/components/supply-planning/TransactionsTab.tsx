
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { InventoryTransaction } from '@/types/inventory/shipmentTypes';

export const TransactionsTab = () => {
  const { language } = useLanguage();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['inventory-transactions'],
    queryFn: async () => {
      // Use any to override the type checking temporarily
      // since the table might not exist yet in the supabase types
      const { data, error } = await (supabase as any)
        .from('inventory_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as InventoryTransaction[];
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <p>{getTranslation("common.inventory.loadingData", language)}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p>{getTranslation("common.inventory.errorLoading", language)}</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">
          {getTranslation("supplyPlanning.tabs.transactions", language) || "Inventory Transactions"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {getTranslation("supplyPlanning.transactionsDesc", language) || "Track all inventory movements and adjustments"}
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{getTranslation("common.date", language) || "Date"}</TableHead>
            <TableHead>{getTranslation("common.inventory.sku", language)}</TableHead>
            <TableHead>{getTranslation("supplyPlanning.type", language) || "Type"}</TableHead>
            <TableHead>{getTranslation("supplyPlanning.quantity", language)}</TableHead>
            <TableHead>{getTranslation("supplyPlanning.previousStock", language) || "Previous Stock"}</TableHead>
            <TableHead>{getTranslation("supplyPlanning.newStock", language) || "New Stock"}</TableHead>
            <TableHead>{getTranslation("supplyPlanning.reference", language) || "Reference"}</TableHead>
            <TableHead>{getTranslation("supplyPlanning.notes", language) || "Notes"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!transactions || transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                {getTranslation("supplyPlanning.noTransactions", language) || "No transactions found"}
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.transaction_date), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{transaction.sku}</TableCell>
                <TableCell>
                  {transaction.transaction_type === 'inbound' ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {getTranslation("supplyPlanning.inbound", language) || "Inbound"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {getTranslation("supplyPlanning.outbound", language) || "Outbound"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>{transaction.previous_on_hand}</TableCell>
                <TableCell>{transaction.new_on_hand}</TableCell>
                <TableCell>
                  {transaction.reference_type && transaction.reference_id 
                    ? `${transaction.reference_type.replace('_', ' ')} #${transaction.reference_id.slice(-6)}` 
                    : '-'}
                </TableCell>
                <TableCell>{transaction.notes || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
