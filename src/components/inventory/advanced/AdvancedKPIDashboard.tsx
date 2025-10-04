import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, Package, Target, Activity } from 'lucide-react';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { useInventoryFilter } from '../InventoryFilterContext';
import { useInventoryConfig } from '@/hooks/useInventoryConfig';

interface KPI {
  label: string;
  value: string | number;
  trend: number;
  status: 'good' | 'warning' | 'critical';
  icon: any;
  subtitle: string;
}

export const AdvancedKPIDashboard: React.FC = () => {
  const { filters } = useInventoryFilter();
  const { getConfig } = useInventoryConfig();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadKPIs();
  }, [filters]);

  const loadKPIs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();
      
      // Apply filters
      let filtered = data;
      if (filters.productId) {
        filtered = filtered.filter(item => item.product_id === filters.productId);
      }
      if (filters.locationId) {
        filtered = filtered.filter(item => item.location_id === filters.locationId);
      }
      if (filters.decouplingOnly) {
        filtered = filtered.filter(item => item.decoupling_point);
      }

      // Calculate KPIs
      const totalItems = filtered.length;
      const redStatus = filtered.filter(item => item.buffer_status === 'RED').length;
      const yellowStatus = filtered.filter(item => item.buffer_status === 'YELLOW').length;
      const greenStatus = filtered.filter(item => item.buffer_status === 'GREEN').length;
      
      const serviceLevel = totalItems > 0 ? ((greenStatus + yellowStatus) / totalItems * 100) : 0;
      const inventoryHealth = totalItems > 0 ? (greenStatus / totalItems * 100) : 0;
      const criticalItems = redStatus;
      
      const totalValue = filtered.reduce((sum, item) => sum + (item.on_hand * getConfig('inventory_value_multiplier', 100)), 0);
      const avgFillRate = totalItems > 0 ? (filtered.reduce((sum, item) => {
        const fillRate = item.tog > 0 ? Math.min((item.nfp / item.tog) * 100, 100) : 0;
        return sum + fillRate;
      }, 0) / totalItems) : 0;

      const avgTurnover = totalItems > 0 ? (filtered.reduce((sum, item) => {
        const turnover = item.on_hand > 0 && item.average_daily_usage > 0 
          ? (item.average_daily_usage * 365) / item.on_hand 
          : 0;
        return sum + turnover;
      }, 0) / totalItems) : 0;

      const serviceLevelGood = getConfig('service_level_good_threshold', 95);
      const serviceLevelWarning = getConfig('service_level_warning_threshold', 90);
      const inventoryHealthGood = getConfig('inventory_health_good_threshold', 70);
      const inventoryHealthWarning = getConfig('inventory_health_warning_threshold', 50);
      const criticalItemsWarning = getConfig('critical_items_warning_threshold', 5);
      const fillRateGood = getConfig('fill_rate_good_threshold', 90);
      const fillRateWarning = getConfig('fill_rate_warning_threshold', 80);
      const turnoverGood = getConfig('turnover_good_threshold', 4);
      const turnoverWarning = getConfig('turnover_warning_threshold', 2);

      setKpis([
        {
          label: 'Service Level',
          value: `${serviceLevel.toFixed(1)}%`,
          trend: 2.5,
          status: serviceLevel >= serviceLevelGood ? 'good' : serviceLevel >= serviceLevelWarning ? 'warning' : 'critical',
          icon: Target,
          subtitle: `${greenStatus + yellowStatus} of ${totalItems} items`
        },
        {
          label: 'Inventory Health',
          value: `${inventoryHealth.toFixed(1)}%`,
          trend: -1.2,
          status: inventoryHealth >= inventoryHealthGood ? 'good' : inventoryHealth >= inventoryHealthWarning ? 'warning' : 'critical',
          icon: Activity,
          subtitle: `${greenStatus} green zones`
        },
        {
          label: 'Critical Items',
          value: criticalItems,
          trend: redStatus > criticalItemsWarning ? -5.3 : 2.1,
          status: criticalItems === 0 ? 'good' : criticalItems <= criticalItemsWarning ? 'warning' : 'critical',
          icon: AlertTriangle,
          subtitle: `${redStatus} red zones`
        },
        {
          label: 'Total Inventory Value',
          value: `$${(totalValue / 1000).toFixed(0)}K`,
          trend: 3.8,
          status: 'good',
          icon: Package,
          subtitle: `${totalItems} items tracked`
        },
        {
          label: 'Avg Fill Rate',
          value: `${avgFillRate.toFixed(1)}%`,
          trend: 1.5,
          status: avgFillRate >= fillRateGood ? 'good' : avgFillRate >= fillRateWarning ? 'warning' : 'critical',
          icon: TrendingUp,
          subtitle: 'Buffer penetration'
        },
        {
          label: 'Inventory Turnover',
          value: avgTurnover.toFixed(1),
          trend: 2.3,
          status: avgTurnover >= turnoverGood ? 'good' : avgTurnover >= turnoverWarning ? 'warning' : 'critical',
          icon: Activity,
          subtitle: 'Times per year'
        }
      ]);
    } catch (error) {
      console.error('Error loading KPIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'hsl(142 71% 45%)';
      case 'warning': return 'hsl(48 96% 53%)';
      case 'critical': return 'hsl(0 84% 60%)';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi, index) => (
        <Card 
          key={index} 
          className="p-6 hover:shadow-lg transition-shadow border-l-4"
          style={{ borderLeftColor: getStatusColor(kpi.status) }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="h-5 w-5" style={{ color: getStatusColor(kpi.status) }} />
                <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
              </div>
              <div className="text-3xl font-bold mb-1">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.subtitle}</div>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
              kpi.trend >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
            }`}>
              {kpi.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(kpi.trend).toFixed(1)}%
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
