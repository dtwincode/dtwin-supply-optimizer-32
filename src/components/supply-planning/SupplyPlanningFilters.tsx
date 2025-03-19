
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
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Badge } from '@/components/ui/badge';

export const SupplyPlanningFilters = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  return (
    <Card className="p-4 mb-6 border-dtwin-medium/20 bg-gradient-to-r from-white to-dtwin-light/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={getTranslation("supplyPlanning.searchItems", language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-dtwin-medium/30 focus:border-dtwin-dark focus:ring-dtwin-dark"
          />
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={getTranslation("supplyPlanning.supplier", language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getTranslation("supplyPlanning.all", language)}</SelectItem>
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
                <SelectItem value="all">{getTranslation("supplyPlanning.all", language)}</SelectItem>
                <SelectItem value="planned">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.statusTypes.planned", language)}
                  </div>
                </SelectItem>
                <SelectItem value="ordered">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.statusTypes.ordered", language)}
                  </div>
                </SelectItem>
                <SelectItem value="confirmed">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.statusTypes.confirmed", language)}
                  </div>
                </SelectItem>
                <SelectItem value="shipped">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.statusTypes.shipped", language)}
                  </div>
                </SelectItem>
                <SelectItem value="received">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.statusTypes.received", language)}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={getTranslation("supplyPlanning.priority", language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getTranslation("supplyPlanning.all", language)}</SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.priorityLevels.critical", language)}
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.priorityLevels.high", language)}
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.priorityLevels.medium", language)}
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="h-2 w-2 rounded-full p-0" />
                    {getTranslation("supplyPlanning.priorityLevels.low", language)}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-dtwin-medium/30">
              <Filter className="h-4 w-4" />
              <span className="sr-only">{getTranslation("common.filter", language)}</span>
            </Button>
            
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-dtwin-medium/30">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">{getTranslation("supplyPlanning.refresh", language)}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
