
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

export const SupplyPlanningFilters = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={getTranslation("supplyPlanning.searchItems", language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={getTranslation("supplyPlanning.supplier", language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getTranslation("common.all", language)}</SelectItem>
                <SelectItem value="supplier1">Supplier A</SelectItem>
                <SelectItem value="supplier2">Supplier B</SelectItem>
                <SelectItem value="supplier3">Supplier C</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={getTranslation("supplyPlanning.status", language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getTranslation("common.all", language)}</SelectItem>
                <SelectItem value="planned">{getTranslation("supplyPlanning.status.planned", language)}</SelectItem>
                <SelectItem value="ordered">{getTranslation("supplyPlanning.status.ordered", language)}</SelectItem>
                <SelectItem value="confirmed">{getTranslation("supplyPlanning.status.confirmed", language)}</SelectItem>
                <SelectItem value="shipped">{getTranslation("supplyPlanning.status.shipped", language)}</SelectItem>
                <SelectItem value="received">{getTranslation("supplyPlanning.status.received", language)}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={getTranslation("supplyPlanning.priority", language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getTranslation("common.all", language)}</SelectItem>
                <SelectItem value="critical">{getTranslation("supplyPlanning.priority.critical", language)}</SelectItem>
                <SelectItem value="high">{getTranslation("supplyPlanning.priority.high", language)}</SelectItem>
                <SelectItem value="medium">{getTranslation("supplyPlanning.priority.medium", language)}</SelectItem>
                <SelectItem value="low">{getTranslation("supplyPlanning.priority.low", language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">{getTranslation("common.filter", language)}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
