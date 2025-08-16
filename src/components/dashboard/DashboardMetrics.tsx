
import { Card } from "@/components/ui/card";
import { Package, ShieldAlert, Zap, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";

const DashboardMetrics = () => {
  const { language } = useLanguage();

  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      return toArabicNumerals(num);
    }
    return num.toString();
  };

  const formatPercentage = (percentage: number): string => {
    if (language === 'ar') {
      return `${toArabicNumerals(percentage)}%`;
    }
    return `${percentage}%`;
  };

  return (
    <div className="dashboard-card">
      <h4 className="text-xl font-bold mb-4 flex items-center">
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          marginRight: '0.75rem'
        }}>
          <Package style={{ height: '1.5rem', width: '1.5rem', color: '#3b82f6' }} />
        </div>
        {getTranslation('common.dashboardMetrics.title', language)}
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="dashboard-card" style={{ 
          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div className="flex justify-between items-center">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '600' }}>
                {getTranslation('common.dashboardMetrics.totalSKUs', language)}
              </p>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1e3a8a' }}>
                {formatNumber(1234)}
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '0.875rem', 
                color: '#059669',
                backgroundColor: '#d1fae5',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px'
              }}>
                <TrendingUp style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                <span style={{ fontWeight: '500' }}>+5.2%</span>
              </div>
            </div>
            <div style={{
              backgroundColor: '#3b82f6',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <Package style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
            </div>
          </div>
        </div>
        
        <div className="dashboard-card" style={{ 
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          borderLeft: '4px solid #10b981'
        }}>
          <div className="flex justify-between items-center">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: '600' }}>
                {getTranslation('common.dashboardMetrics.bufferPenetration', language)}
              </p>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#064e3b' }}>
                {formatPercentage(78)}
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '0.875rem', 
                color: '#059669',
                backgroundColor: '#d1fae5',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px'
              }}>
                <TrendingUp style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                <span style={{ fontWeight: '500' }}>+3.4%</span>
              </div>
            </div>
            <div style={{
              backgroundColor: '#10b981',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <ShieldAlert style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
