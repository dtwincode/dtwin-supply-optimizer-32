
import React, { useState } from 'react';
import { format, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { marketingPlansData } from '@/data/marketingData';

export const MarketingCalendarView = () => {
  const { language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const t = (key: string) => getTranslation(`marketing.${key}`, language) || key;

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  
  // Generate days for current month view
  const generateDaysArray = () => {
    const days = [];
    let day = startDate;
    
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    return days;
  };
  
  const days = generateDaysArray();
  
  // Find campaigns for a specific date
  const getCampaignsForDate = (date) => {
    return marketingPlansData.filter(campaign => {
      const campaignStart = parseISO(campaign.startDate);
      const campaignEnd = parseISO(campaign.endDate);
      
      return date >= campaignStart && date <= campaignEnd;
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Get color for promotion type
  const getPromotionColor = (type) => {
    switch(type) {
      case 'seasonal-sale': return 'bg-green-100 text-green-800';
      case 'themed-promotion': return 'bg-blue-100 text-blue-800';
      case 'clearance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            &lt;
          </button>
          <h2 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={goToNextMonth}
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map(date => {
            const campaigns = getCampaignsForDate(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div 
                key={date.toString()} 
                className={`
                  min-h-[50px] p-1 border rounded-sm text-xs
                  ${isSameMonth(date, currentMonth) ? '' : 'text-gray-300 bg-gray-50'}
                  ${isToday ? 'border-blue-500' : 'border-gray-100'}
                `}
              >
                <div className="font-medium mb-1">{format(date, 'd')}</div>
                <div className="space-y-1">
                  {campaigns.length > 0 && campaigns.slice(0, 2).map(campaign => (
                    <Badge 
                      key={campaign.id} 
                      variant="outline"
                      className={`text-[9px] truncate block ${getPromotionColor(campaign.promotionType)}`}
                    >
                      {campaign.name.substring(0, 10)}...
                    </Badge>
                  ))}
                  {campaigns.length > 2 && (
                    <div className="text-[9px] text-gray-500">
                      +{campaigns.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
