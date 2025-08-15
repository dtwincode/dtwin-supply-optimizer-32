
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MessageSquare, Users, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ExecutionItem {
  id: number;
  text: string;
  type: 'action' | 'alert' | 'decision' | 'note';
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

// Sample execution items
const initialItems: ExecutionItem[] = [
  {
    id: 1,
    text: "Analyze buffer penetration spike in South Region distribution centers",
    type: "action",
    status: "in-progress",
    priority: "high",
    timestamp: "10 minutes ago"
  },
  {
    id: 2,
    text: "West Region reporting delayed shipments due to weather conditions",
    type: "alert",
    status: "pending",
    priority: "high",
    timestamp: "32 minutes ago"
  },
  {
    id: 3,
    text: "Production schedule adjusted due to demand signal variance",
    type: "decision",
    status: "completed",
    priority: "medium",
    timestamp: "2 hours ago"
  },
  {
    id: 4,
    text: "Buffer profiles need review for seasonal adjustment in next cycle",
    type: "note",
    status: "pending",
    priority: "medium",
    timestamp: "3 hours ago"
  },
  {
    id: 5,
    text: "Tactical cycle reconciliation completed for Q2 products",
    type: "action",
    status: "completed",
    priority: "medium",
    timestamp: "1 day ago"
  }
];

export const CollaborativeExecution: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.ddsop.${key}`, language) || key;
  const [items, setItems] = useState<ExecutionItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState("");
  const [activeTab, setActiveTab] = useState<string>("actions");

  const handleAddItem = () => {
    if (!newItemText.trim()) return;

    const newItem: ExecutionItem = {
      id: Math.max(0, ...items.map(item => item.id)) + 1,
      text: newItemText,
      type: activeTab.slice(0, -1) as 'action' | 'alert' | 'decision' | 'note',
      status: "pending",
      priority: "medium",
      timestamp: t('justNow')
    };

    setItems([newItem, ...items]);
    setNewItemText("");
    toast.success(t('itemAdded'));
  };

  const handleSharePlan = () => {
    toast.success(t('executionPlanShared'));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">{t('completed')}</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">{t('inProgress')}</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline">{t('pending')}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="ml-2">{t('highPriority')}</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="ml-2">{t('mediumPriority')}</Badge>;
      case 'low':
      default:
        return <Badge variant="outline" className="ml-2">{t('lowPriority')}</Badge>;
    }
  };

  const filteredItems = items.filter(item => 
    activeTab === "all" || item.type === activeTab.slice(0, -1)
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-dtwin-medium" />
            {t('collaborativeExecution')}
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleSharePlan} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            {t('shareExecutionPlan')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="actions" onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="actions">{t('actions')}</TabsTrigger>
              <TabsTrigger value="alerts">{t('alerts')}</TabsTrigger>
              <TabsTrigger value="decisions">{t('decisions')}</TabsTrigger>
              <TabsTrigger value="notes">{t('notes')}</TabsTrigger>
              <TabsTrigger value="all">{t('all')}</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 pt-4 pb-0">
            <div className="flex gap-2">
              <Input 
                placeholder={t('addNewItem')}
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                className="flex-1"
              />
              <Button onClick={handleAddItem}>
                {t('add')}
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="m-0 p-0">
            <div className="px-6 py-4 max-h-[300px] overflow-y-auto">
              <div className="space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No items available
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div key={item.id} className="border rounded-md p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p>{item.text}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>{item.timestamp}</span>
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex justify-end">
        <div className="flex items-center text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{filteredItems.length} items</span>
        </div>
      </CardFooter>
    </Card>
  );
};
