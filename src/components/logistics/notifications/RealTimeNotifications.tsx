
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Clock, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { supabase } from '@/integrations/supabase/client';

interface LogisticsNotification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  message: string;
  timestamp: string;
  read: boolean;
  details?: Record<string, any>;
}

export const RealTimeNotifications: React.FC = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<LogisticsNotification[]>([
    {
      id: '1',
      type: 'alert',
      message: 'Shipment ORD-20240315-001 is delayed due to weather conditions',
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      read: false,
      details: { orderId: 'ORD-20240315-001', delay: '3 hours', reason: 'weather' }
    },
    {
      id: '2',
      type: 'success',
      message: 'Shipment ORD-20240314-002 has been delivered successfully',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      read: true,
      details: { orderId: 'ORD-20240314-002', recipient: 'Abdullah Alhamed' }
    },
    {
      id: '3',
      type: 'info',
      message: 'Route optimization suggestion: Save 12% fuel by rerouting deliveries',
      timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
      read: false,
      details: { savings: '12%', routes: ['Route-123', 'Route-124'] }
    },
    {
      id: '4',
      type: 'warning',
      message: 'Carrier performance dropping for SMSA Express (on-time delivery -8%)',
      timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
      read: false,
      details: { carrier: 'SMSA Express', metric: 'on-time delivery', change: '-8%' }
    }
  ]);

  useEffect(() => {
    const channel = supabase
      .channel('logistics-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'logistics_notifications'
        },
        (payload) => {
          // Add new notification and show toast
          const newNotification = payload.new as LogisticsNotification;
          setNotifications(prev => [newNotification, ...prev]);
          
          toast.info(newNotification.message, {
            description: `${new Date(newNotification.timestamp).toLocaleTimeString()}`,
            action: {
              label: 'View',
              onClick: () => console.log('Viewed notification', newNotification.id)
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success(getTranslation('common.logistics.allNotificationsRead', language) || 
      'All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    
    if (minutes < 1) return getTranslation('common.logistics.justNow', language) || 'Just now';
    if (minutes < 60) return `${minutes} ${getTranslation('common.logistics.minutesAgo', language) || 'minutes ago'}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${getTranslation('common.logistics.hoursAgo', language) || 'hours ago'}`;
    
    const days = Math.floor(hours / 24);
    return `${days} ${getTranslation('common.logistics.daysAgo', language) || 'days ago'}`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'alert': return getTranslation('common.logistics.alert', language) || 'Alert';
      case 'success': return getTranslation('common.logistics.success', language) || 'Success';
      case 'info': return getTranslation('common.logistics.info', language) || 'Info';
      case 'warning': return getTranslation('common.logistics.warning', language) || 'Warning';
      default: return type;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CardTitle className="text-xl">
              {getTranslation('common.logistics.notifications', language) || "Notifications"}
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} {getTranslation('common.logistics.new', language) || 'New'}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              {getTranslation('common.logistics.markAllRead', language) || 'Mark All Read'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {getTranslation('common.logistics.noNotifications', language) || 'No notifications yet'}
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border rounded-lg flex items-start gap-3 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-normal">
                      {getNotificationTypeLabel(notification.type)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{notification.message}</p>
                  <div className="mt-2 flex justify-end gap-2">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs h-7 px-2"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {getTranslation('common.logistics.markRead', language) || 'Mark Read'}
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs h-7 px-2"
                    >
                      <X className="h-3 w-3 mr-1" />
                      {getTranslation('common.logistics.dismiss', language) || 'Dismiss'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
