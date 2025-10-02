import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, RefreshCw, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface ConfigItem {
  id: string;
  config_key: string;
  config_value: number;
  description: string | null;
  category: string;
  last_updated_by: string | null;
}

interface AuditLog {
  id: string;
  config_key: string;
  old_value: number;
  new_value: number;
  changed_by: string | null;
  changed_at: string;
}

export function InventoryConfigTab() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);

  const fetchConfigs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("inventory_config")
        .select("*")
        .order("category", { ascending: true })
        .order("config_key", { ascending: true });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error("Error fetching configs:", error);
      toast({
        title: "Error Loading Configuration",
        description: "Failed to load inventory configuration values.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleValueChange = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setEditedValues((prev) => ({ ...prev, [id]: numValue }));
    }
  };

  const handleSave = async (id: string, configKey: string) => {
    if (!(id in editedValues)) return;

    setIsSaving(true);
    try {
      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("inventory_config")
        .update({ 
          config_value: editedValues[id], 
          updated_at: new Date().toISOString(),
          last_updated_by: user?.id || null
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setConfigs((prev) =>
        prev.map((config) =>
          config.id === id ? { 
            ...config, 
            config_value: editedValues[id],
            last_updated_by: user?.id || null
          } : config
        )
      );

      // Clear edited value
      setEditedValues((prev) => {
        const newValues = { ...prev };
        delete newValues[id];
        return newValues;
      });

      toast({
        title: "Configuration Updated",
        description: `${configKey} has been updated successfully and logged.`,
      });
    } catch (error) {
      console.error("Error updating config:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchAuditLogs = async (configId: string) => {
    try {
      const { data, error } = await supabase
        .from("inventory_config_audit")
        .select("*")
        .eq("config_id", configId)
        .order("changed_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast({
        title: "Error Loading History",
        description: "Failed to load change history.",
        variant: "destructive",
      });
    }
  };

  const handleViewHistory = (configId: string) => {
    setSelectedConfigId(configId);
    fetchAuditLogs(configId);
    setIsAuditDialogOpen(true);
  };

  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, ConfigItem[]>);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Inventory Configuration Settings
          </CardTitle>
          <CardDescription>
            Manage system-wide thresholds and parameters for inventory planning and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchConfigs} variant="outline" size="sm" className="mb-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {Object.entries(groupedConfigs).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">{category.replace(/_/g, " ")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Parameter</TableHead>
                  <TableHead className="w-1/3">Description</TableHead>
                  <TableHead className="w-1/6">Current Value</TableHead>
                  <TableHead className="w-1/6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((config) => {
                  const hasEdit = config.id in editedValues;
                  const displayValue = hasEdit
                    ? editedValues[config.id]
                    : config.config_value;

                  return (
                    <TableRow key={config.id}>
                      <TableCell className="font-medium">
                        {config.config_key.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {config.description || "No description available"}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={displayValue}
                          onChange={(e) => handleValueChange(config.id, e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSave(config.id, config.config_key)}
                            disabled={!hasEdit || isSaving}
                            size="sm"
                            variant={hasEdit ? "default" : "ghost"}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {hasEdit ? "Save" : "Saved"}
                          </Button>
                          <Button
                            onClick={() => handleViewHistory(config.id)}
                            size="sm"
                            variant="outline"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change History</DialogTitle>
            <DialogDescription>
              View all changes made to this configuration parameter
            </DialogDescription>
          </DialogHeader>
          
          {auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No change history available
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Changed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {format(new Date(log.changed_at), "PPpp")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.config_key.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.old_value}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {log.new_value}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.changed_by ? log.changed_by.substring(0, 8) : "System"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
