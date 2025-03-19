
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Share2,
  Calendar,
  Divide,
  Pin
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Reusing the TeamCollaboration component's structure but adapting it for DDOM
interface CollaborationItem {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  category: 'action' | 'alert' | 'note' | 'decision';
  status?: 'pending' | 'completed' | 'in-progress';
  priority?: 'high' | 'medium' | 'low';
}

export const DDOMCollaborativeExecution: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.ddom.${key}`, language) || key;
  
  const [activeTab, setActiveTab] = useState('actions');
  const [newItem, setNewItem] = useState('');
  const [collaborationItems, setCollaborationItems] = useState<CollaborationItem[]>([
    {
      id: '1',
      user: 'Ahmed Al-Farsi',
      text: 'Tactical planning meeting scheduled for tomorrow at 10 AM to address buffer penetration in Zone A',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      category: 'action',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      user: 'Sarah Johnson',
      text: 'Alert: Resource utilization below target in manufacturing line 3',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      category: 'alert',
      priority: 'medium'
    },
    {
      id: '3',
      user: 'Mohammed Al-Qasim',
      text: 'Decision made to increase buffer levels by 15% for high-volatility SKUs',
      timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
      category: 'decision',
      status: 'completed',
      priority: 'high'
    },
    {
      id: '4',
      user: 'Lisa Wong',
      text: 'Weekly demand signal quality report shows 5% improvement after algorithm adjustment',
      timestamp: new Date(Date.now() - 1440 * 60000).toISOString(),
      category: 'note',
      priority: 'low'
    }
  ]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    const item: CollaborationItem = {
      id: Date.now().toString(),
      user: 'Current User',
      text: newItem,
      timestamp: new Date().toISOString(),
      category: activeTab === 'actions' ? 'action' : 
                activeTab === 'alerts' ? 'alert' : 
                activeTab === 'decisions' ? 'decision' : 'note',
      status: activeTab === 'actions' ? 'pending' : undefined,
      priority: 'medium'
    };
    
    setCollaborationItems(prev => [item, ...prev]);
    setNewItem('');
    toast.success(t('itemAdded'));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'action':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'decision':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'note':
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">{t('completed')}</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-600">{t('inProgress')}</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline">{t('pending')}</Badge>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-500">{t('highPriority')}</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">{t('mediumPriority')}</Badge>;
      case 'low':
      default:
        return <Badge variant="outline" className="border-green-500 text-green-500">{t('lowPriority')}</Badge>;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    
    if (minutes < 1) return t('justNow');
    if (minutes < 60) return `${minutes} ${t('minutesAgo')}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${t('hoursAgo')}`;
    
    const days = Math.floor(hours / 24);
    return `${days} ${t('daysAgo')}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-dtwin-medium" />
            {t('collaborativeExecution')}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => toast.success(t('executionPlanShared'))}>
            <Share2 className="h-4 w-4 mr-2" />
            {t('shareExecutionPlan')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="actions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="actions" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{t('actions')}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>{t('alerts')}</span>
            </TabsTrigger>
            <TabsTrigger value="decisions" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('decisions')}</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{t('notes')}</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder={t('addNewItem')}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
            <Button onClick={handleAddItem}>{t('add')}</Button>
          </div>
          
          <ScrollArea className="h-[250px]">
            <div className="space-y-4">
              {collaborationItems
                .filter(item => 
                  (activeTab === 'actions' && item.category === 'action') ||
                  (activeTab === 'alerts' && item.category === 'alert') ||
                  (activeTab === 'decisions' && item.category === 'decision') ||
                  (activeTab === 'notes' && item.category === 'note')
                )
                .map(item => (
                  <div 
                    key={item.id}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <span className="font-medium">{item.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};
