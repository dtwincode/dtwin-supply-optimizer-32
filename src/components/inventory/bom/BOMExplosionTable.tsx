import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useInventoryFilter } from '../InventoryFilterContext';
import * as XLSX from 'xlsx';

interface ComponentExplosion {
  component_product_id: string;
  component_sku: string;
  component_name: string;
  component_category: string;
  location_id: string;
  component_adu: number;
  total_demand_90d: number;
  num_finished_goods_using: number;
  used_in_finished_goods: string[];
  demand_cv: number;
  high_variability: boolean;
  buffer_status?: 'RED' | 'YELLOW' | 'GREEN';
  nfp?: number;
  tor?: number;
}

export function BOMExplosionTable() {
  const { filters } = useInventoryFilter();
  const [explosionData, setExplosionData] = useState<ComponentExplosion[]>([]);
  const [filteredData, setFilteredData] = useState<ComponentExplosion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadExplosionData();
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, [explosionData, searchTerm, locationFilter, categoryFilter]);

  const loadExplosionData = async () => {
    try {
      setIsLoading(true);

      // Load component demand from the new view
      let query = supabase
        .from('component_demand_view')
        .select('*');

      if (filters.locationId) {
        query = query.eq('location_id', filters.locationId);
      }

      const { data: components, error: compError } = await query;

      if (compError) throw compError;

      // Aggregate by component across all locations (unless location filter is active)
      const aggregated = new Map<string, ComponentExplosion>();
      
      (components || []).forEach((row: any) => {
        const key = filters.locationId ? `${row.component_product_id}-${row.location_id}` : row.component_product_id;
        
        if (!aggregated.has(key)) {
          aggregated.set(key, {
            component_product_id: row.component_product_id,
            component_sku: row.component_sku,
            component_name: row.component_name,
            component_category: row.component_category,
            location_id: filters.locationId || 'ALL LOCATIONS',
            component_adu: 0,
            total_demand_90d: 0,
            num_finished_goods_using: row.num_finished_goods_using,
            used_in_finished_goods: row.used_in_finished_goods || [],
            demand_cv: 0,
            high_variability: false
          });
        }
        
        const existing = aggregated.get(key)!;
        existing.component_adu += Number(row.component_adu || 0);
        existing.total_demand_90d += Number(row.total_demand_90d || 0);
        existing.demand_cv = ((existing.demand_cv + (row.demand_cv || 0)) / 2);
        existing.high_variability = existing.high_variability || row.high_variability;
      });

      // Convert to array
      const aggregatedArray = Array.from(aggregated.values());

      // Extract unique locations and categories for filters
      const uniqueLocations = [...new Set(components?.map(c => c.location_id).filter(Boolean) || [])] as string[];
      const uniqueCategories = [...new Set(aggregatedArray.map(c => c.component_category).filter(Boolean) || [])] as string[];
      
      setLocations(uniqueLocations);
      setCategories(uniqueCategories);
      setExplosionData(aggregatedArray);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading explosion data:', error);
      toast.error('Failed to load BOM explosion data');
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...explosionData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        row =>
          row.component_name?.toLowerCase().includes(term) ||
          row.component_sku?.toLowerCase().includes(term)
      );
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(row => row.location_id === locationFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(row => row.component_category === categoryFilter);
    }

    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    const exportData = filteredData.map(row => ({
      'Component SKU': row.component_sku,
      'Component Name': row.component_name,
      'Category': row.component_category,
      'Location': row.location_id,
      'Component ADU': row.component_adu.toFixed(2),
      'Total Demand (90d)': row.total_demand_90d.toFixed(2),
      'Used in # Finished Goods': row.num_finished_goods_using,
      'Finished Goods List': row.used_in_finished_goods?.join(', ') || '',
      'Demand CV': row.demand_cv?.toFixed(3) || '',
      'High Variability': row.high_variability ? 'Yes' : 'No'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BOM Explosion');
    XLSX.writeFile(wb, `BOM_Explosion_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data exported to Excel');
  };

  const getBufferStatusBadge = (cv: number | null) => {
    if (!cv) return <Badge variant="outline">N/A</Badge>;
    
    if (cv > 0.5) return <Badge className="bg-red-500 text-white">HIGH</Badge>;
    if (cv > 0.3) return <Badge className="bg-yellow-500 text-white">MEDIUM</Badge>;
    return <Badge className="bg-green-500 text-white">LOW</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>BOM Explosion Analysis</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Component demand exploded from finished goods sales
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredData.length} of {explosionData.length} components
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Component SKU</TableHead>
                  <TableHead>Component Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Component ADU</TableHead>
                  <TableHead className="text-right">90d Demand</TableHead>
                  <TableHead className="text-right"># Finished Goods</TableHead>
                  <TableHead>Variability</TableHead>
                  <TableHead>Used In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No components found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow key={`${row.component_product_id}-${row.location_id}`}>
                      <TableCell className="font-mono text-sm">{row.component_sku}</TableCell>
                      <TableCell className="font-medium">{row.component_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.component_category}</Badge>
                      </TableCell>
                      <TableCell>{row.location_id}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {row.component_adu.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.total_demand_90d.toFixed(0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.num_finished_goods_using}
                      </TableCell>
                      <TableCell>
                        {getBufferStatusBadge(row.demand_cv)}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="flex flex-wrap gap-1">
                          {row.used_in_finished_goods?.slice(0, 3).map((fg, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {fg}
                            </Badge>
                          ))}
                          {row.used_in_finished_goods?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{row.used_in_finished_goods.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
