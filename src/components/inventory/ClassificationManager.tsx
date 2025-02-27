
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Info, Save, Play, BarChart4 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SKUClassification } from "./types";

type ClassificationConfig = {
  type: 'ABC' | 'XYZ' | 'PQR';
  thresholds: number[];
  description: string;
  criteriaField: string;
  labels: string[];
}

const defaultConfigs: ClassificationConfig[] = [
  {
    type: 'ABC',
    thresholds: [70, 90],
    description: 'Value-based categorization',
    criteriaField: 'annual_usage_value',
    labels: ['A', 'B', 'C']
  },
  {
    type: 'XYZ',
    thresholds: [20, 50],
    description: 'Variability-based categorization',
    criteriaField: 'coefficient_of_variation',
    labels: ['X', 'Y', 'Z']
  },
  {
    type: 'PQR',
    thresholds: [80, 95],
    description: 'BOM usage categorization',
    criteriaField: 'bom_usage_percentage',
    labels: ['P', 'Q', 'R']
  }
];

const mockItems = [
  { id: 1, sku: 'SKU001', name: 'Product A', annual_usage_value: 120000, coefficient_of_variation: 0.15, bom_usage_percentage: 85 },
  { id: 2, sku: 'SKU002', name: 'Product B', annual_usage_value: 85000, coefficient_of_variation: 0.35, bom_usage_percentage: 90 },
  { id: 3, sku: 'SKU003', name: 'Product C', annual_usage_value: 25000, coefficient_of_variation: 0.60, bom_usage_percentage: 55 },
  { id: 4, sku: 'SKU004', name: 'Product D', annual_usage_value: 10000, coefficient_of_variation: 0.40, bom_usage_percentage: 30 },
  { id: 5, sku: 'SKU005', name: 'Product E', annual_usage_value: 150000, coefficient_of_variation: 0.10, bom_usage_percentage: 95 },
];

export function ClassificationManager() {
  const [configs, setConfigs] = useState<ClassificationConfig[]>(defaultConfigs);
  const [items, setItems] = useState<any[]>(mockItems);
  const [classifications, setClassifications] = useState<Record<string, Record<string, string>>>({});
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ClassificationConfig | null>(null);
  const [activeTab, setActiveTab] = useState('ABC');
  const { toast } = useToast();

  useEffect(() => {
    calculateClassifications();
  }, []);

  const calculateClassifications = () => {
    const newClassifications: Record<string, Record<string, string>> = {};

    items.forEach(item => {
      newClassifications[item.sku] = newClassifications[item.sku] || {};
      
      configs.forEach(config => {
        const value = item[config.criteriaField];
        let classification = '';
        
        if (value >= config.thresholds[0]) {
          classification = config.labels[0];
        } else if (value >= config.thresholds[1]) {
          classification = config.labels[1];
        } else {
          classification = config.labels[2];
        }
        
        newClassifications[item.sku][config.type] = classification;
      });
    });

    setClassifications(newClassifications);
  };

  const saveConfig = () => {
    if (!currentConfig) return;
    
    setConfigs(prevConfigs => 
      prevConfigs.map(c => c.type === currentConfig.type ? currentConfig : c)
    );
    
    setIsConfigOpen(false);
    setCurrentConfig(null);
    
    // Recalculate with new thresholds
    setTimeout(calculateClassifications, 100);
    
    toast({
      title: 'Configuration updated',
      description: `${currentConfig.type} classification thresholds have been updated.`,
    });
  };

  const runClassification = () => {
    calculateClassifications();
    
    toast({
      title: 'Classification completed',
      description: 'All items have been classified according to current settings.',
    });
  };

  const getClassificationBadge = (classification: string) => {
    const colorMap: Record<string, string> = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-gray-100 text-gray-800',
      'X': 'bg-blue-100 text-blue-800',
      'Y': 'bg-purple-100 text-purple-800',
      'Z': 'bg-red-100 text-red-800',
      'P': 'bg-indigo-100 text-indigo-800',
      'Q': 'bg-orange-100 text-orange-800',
      'R': 'bg-pink-100 text-pink-800',
    };
    
    return colorMap[classification] || 'bg-gray-100 text-gray-800';
  };

  const openConfigModal = (configType: 'ABC' | 'XYZ' | 'PQR') => {
    const config = configs.find(c => c.type === configType);
    if (config) {
      setCurrentConfig({...config});
      setIsConfigOpen(true);
    }
  };

  const getBucketPercentage = (type: 'ABC' | 'XYZ' | 'PQR', category: string) => {
    const total = items.length;
    const count = Object.values(classifications).filter(c => c[type] === category).length;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const handleSliderChange = (values: number[]) => {
    if (currentConfig) {
      setCurrentConfig({
        ...currentConfig,
        thresholds: values
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>SKU Classification</CardTitle>
          <CardDescription>
            Manage product categories based on value, variability, and usage
          </CardDescription>
        </div>
        <Button onClick={runClassification} className="flex items-center gap-1">
          <Play size={16} />
          Run Classification
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ABC" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="ABC">Value (ABC)</TabsTrigger>
            <TabsTrigger value="XYZ">Variability (XYZ)</TabsTrigger>
            <TabsTrigger value="PQR">BOM Usage (PQR)</TabsTrigger>
          </TabsList>
          
          {configs.map((config) => (
            <TabsContent key={config.type} value={config.type} className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{config.type} Classification</h3>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
                <Button variant="outline" onClick={() => openConfigModal(config.type as 'ABC' | 'XYZ' | 'PQR')}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                {config.labels.map((label, index) => {
                  const percentage = getBucketPercentage(config.type as 'ABC' | 'XYZ' | 'PQR', label);
                  return (
                    <Card key={label} className="p-4">
                      <div className="flex justify-between items-center">
                        <Badge className={getClassificationBadge(label)}>Category {label}</Badge>
                        <div className="text-2xl font-bold">{percentage}%</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {index === 0 ? 'High ' : index === 1 ? 'Medium ' : 'Low '}
                        {config.type === 'ABC' ? 'Value' : config.type === 'XYZ' ? 'Predictability' : 'Usage'}
                      </p>
                    </Card>
                  );
                })}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>
                      {config.type === 'ABC' ? 'Annual Usage Value' : 
                        config.type === 'XYZ' ? 'Coefficient of Variation' : 'BOM Usage %'}
                    </TableHead>
                    <TableHead>Classification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {config.type === 'ABC' ? `$${item.annual_usage_value.toLocaleString()}` : 
                          config.type === 'XYZ' ? item.coefficient_of_variation.toFixed(2) : `${item.bom_usage_percentage}%`}
                      </TableCell>
                      <TableCell>
                        {classifications[item.sku] && (
                          <Badge className={getClassificationBadge(classifications[item.sku][config.type])}>
                            {classifications[item.sku][config.type]}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure {currentConfig?.type} Classification</DialogTitle>
            <DialogDescription>
              Adjust thresholds for classification categories.
            </DialogDescription>
          </DialogHeader>
          {currentConfig && (
            <>
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Threshold between {currentConfig.labels[0]} and {currentConfig.labels[1]}</Label>
                      <span>{currentConfig.thresholds[0]}%</span>
                    </div>
                    <Slider
                      value={[currentConfig.thresholds[0]]}
                      min={1}
                      max={99}
                      step={1}
                      onValueChange={(values) => handleSliderChange([values[0], currentConfig.thresholds[1]])}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Threshold between {currentConfig.labels[1]} and {currentConfig.labels[2]}</Label>
                      <span>{currentConfig.thresholds[1]}%</span>
                    </div>
                    <Slider
                      value={[currentConfig.thresholds[1]]}
                      min={1}
                      max={currentConfig.thresholds[0] - 1}
                      step={1}
                      onValueChange={(values) => handleSliderChange([currentConfig.thresholds[0], values[0]])}
                    />
                  </div>
                  
                  <div className="relative pt-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-between text-xs">
                      <div className="px-2 bg-background">0%</div>
                      <div className="px-2 bg-background">{currentConfig.thresholds[1]}%</div>
                      <div className="px-2 bg-background">{currentConfig.thresholds[0]}%</div>
                      <div className="px-2 bg-background">100%</div>
                    </div>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="flex justify-between text-xs">
                      <div className="text-center px-2">
                        <Badge className={getClassificationBadge(currentConfig.labels[2])}>
                          {currentConfig.labels[2]}
                        </Badge>
                      </div>
                      <div className="text-center px-4">
                        <Badge className={getClassificationBadge(currentConfig.labels[1])}>
                          {currentConfig.labels[1]}
                        </Badge>
                      </div>
                      <div className="text-center px-2">
                        <Badge className={getClassificationBadge(currentConfig.labels[0])}>
                          {currentConfig.labels[0]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={saveConfig}>Save changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
