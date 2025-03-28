
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, FileText, Search, CalendarRange, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryTransaction } from "@/types/inventory/shipmentTypes";
import { supabase } from "@/integrations/supabase/client";

// Define an extended transaction type with required previousQuantity and newQuantity
type EnrichedTransaction = InventoryTransaction & {
  previousQuantity: number; 
  newQuantity: number;
};

// Mock data for demonstration
const mockTransactions: InventoryTransaction[] = [
  {
    id: "1",
    sku: "PROD-001",
    quantity: 120,
    transactionType: "inbound",
    referenceId: "PO-001",
    referenceType: "purchase_order",
    notes: "Received from supplier ABC",
    timestamp: "2023-04-10T10:15:00Z"
  },
  {
    id: "2",
    sku: "PROD-005",
    quantity: 50,
    transactionType: "outbound",
    referenceId: "SO-042",
    referenceType: "sales_order",
    notes: "Customer order fulfillment",
    timestamp: "2023-04-09T14:30:00Z"
  },
  {
    id: "3",
    sku: "PROD-002",
    quantity: 75,
    transactionType: "inbound",
    referenceId: "PO-028",
    referenceType: "purchase_order",
    notes: "Partial delivery from XYZ Corp",
    timestamp: "2023-04-07T09:45:00Z"
  },
  {
    id: "4",
    sku: "PROD-003",
    quantity: 35,
    transactionType: "outbound",
    referenceId: "SHP-015",
    referenceType: "shipment",
    notes: "Shipping to Dallas warehouse",
    timestamp: "2023-04-06T16:20:00Z"
  }
];

// For a real app, we would fetch from API
// This is a mock function to simulate database previous and new values
const enrichTransactions = (transactions: InventoryTransaction[]): EnrichedTransaction[] => {
  return transactions.map((t, index) => ({
    ...t,
    previousQuantity: t.transactionType === "inbound" ? 100 + index * 10 : 200 + index * 10,
    newQuantity: t.transactionType === "inbound" 
      ? (100 + index * 10) + t.quantity 
      : (200 + index * 10) - t.quantity
  }));
};

export const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>(
    enrichTransactions(mockTransactions)
  );
  const [filteredTransactions, setFilteredTransactions] = useState<EnrichedTransaction[]>(
    enrichTransactions(mockTransactions)
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const { language } = useLanguage();
  
  const t = (key: string): string => getTranslation(`supplyPlanning.${key}`, language);

  // Filter transactions based on type, search query, and date range
  useEffect(() => {
    let filtered = transactions;
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(tx => tx.transactionType === typeFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.sku.toLowerCase().includes(query) || 
        (tx.notes && tx.notes.toLowerCase().includes(query)) ||
        (tx.referenceId && tx.referenceId.toLowerCase().includes(query))
      );
    }
    
    if (dateRange.from) {
      filtered = filtered.filter(tx => 
        tx.timestamp && new Date(tx.timestamp) >= new Date(dateRange.from!)
      );
    }
    
    if (dateRange.to) {
      filtered = filtered.filter(tx => 
        tx.timestamp && new Date(tx.timestamp) <= new Date(dateRange.to!)
      );
    }
    
    setFilteredTransactions(filtered);
  }, [typeFilter, searchQuery, dateRange, transactions]);

  const resetFilters = () => {
    setTypeFilter("all");
    setSearchQuery("");
    setDateRange({});
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t('transactions')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('transactionsDesc')}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder={t('search') || "Search transactions..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t('transactionType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allTypes') || "All Types"}</SelectItem>
                  <SelectItem value="inbound">{t('inbound')}</SelectItem>
                  <SelectItem value="outbound">{t('outbound')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                placeholder={t('fromDate') || "From"}
                value={dateRange.from || ""}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-[150px]"
              />
              
              <Input
                type="date"
                placeholder={t('toDate') || "To"}
                value={dateRange.to || ""}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-[150px]"
              />
              
              <Button variant="outline" size="icon" onClick={resetFilters}>
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-2">{t('noTransactionsFound')}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transactionDate')}</TableHead>
                    <TableHead>{t('sku')}</TableHead>
                    <TableHead>{t('transactionType')}</TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead>{t('previousQuantity')}</TableHead>
                    <TableHead>{t('newQuantity')}</TableHead>
                    <TableHead>{t('reference')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.timestamp && new Date(transaction.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{transaction.sku}</TableCell>
                      <TableCell>
                        {transaction.transactionType === "inbound" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center w-fit">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            {t('inbound')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center w-fit">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {t('outbound')}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.previousQuantity}</TableCell>
                      <TableCell>{transaction.newQuantity}</TableCell>
                      <TableCell>
                        {transaction.referenceType && transaction.referenceId && (
                          <span className="text-xs inline-flex items-center">
                            {transaction.referenceType === "purchase_order" ? "PO" : 
                             transaction.referenceType === "sales_order" ? "SO" : "SH"}
                            : {transaction.referenceId}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
