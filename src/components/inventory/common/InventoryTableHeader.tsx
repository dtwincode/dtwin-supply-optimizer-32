
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/contexts/I18nContext';

interface InventoryTableHeaderProps {
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
}

export const InventoryTableHeader: React.FC<InventoryTableHeaderProps> = ({
  onSearch,
  onRefresh,
  searchPlaceholder
}) => {
  const { t } = useI18n();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder || t('inventory.searchProducts')}
          className="pl-8"
          onChange={handleSearchChange}
        />
      </div>
      {onRefresh && (
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="w-full sm:w-auto"
        >
          {t('inventory.refresh')}
        </Button>
      )}
    </div>
  );
};
