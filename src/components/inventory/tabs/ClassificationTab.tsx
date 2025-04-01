
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSkuClassifications } from "@/hooks/useSkuClassifications";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SKUClassification } from "@/types/inventory";
import { supabase } from "@/lib/supabaseClient";

export function ClassificationTab() {
  const { toast } = useToast();
  const { classifications, loading, refreshClassifications } = useSkuClassifications();
  const [searchText, setSearchText] = useState("");
  const [filteredClassifications, setFilteredClassifications] = useState<SKUClassification[]>([]);
  
  useEffect(() => {
    setFilteredClassifications(
      classifications.filter(c => 
        c.sku.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [classifications, searchText]);

  const handleRefresh = async () => {
    try {
      await refreshClassifications();
      toast({
        title: "Data refreshed",
        description: "SKU classifications have been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh classification data",
        variant: "destructive"
      });
    }
  };

  const getLeadTimeColor = (category: string | undefined) => {
    if (!category) return "bg-gray-100 text-gray-800";
    switch (category.toString().toLowerCase()) {
      case "short": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "long": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVariabilityColor = (level: string | undefined) => {
    if (!level) return "bg-gray-100 text-gray-800";
    switch (level.toString().toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCriticalityColor = (criticality: string | undefined) => {
    if (!criticality) return "bg-gray-100 text-gray-800";
    switch (criticality.toString().toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Function to generate some sample data if database is empty
  const generateSampleData = async () => {
    try {
      const sampleData = [
        {
          product_id: "P001",
          location_id: "L001",
          lead_time_category: "short",
          variability_level: "low",
          criticality: "medium",
          score: 65,
          classification_label: "A-Class"
        },
        {
          product_id: "P002",
          location_id: "L001",
          lead_time_category: "medium",
          variability_level: "medium",
          criticality: "high",
          score: 85,
          classification_label: "A-Class"
        },
        {
          product_id: "P003",
          location_id: "L002",
          lead_time_category: "long",
          variability_level: "high",
          criticality: "high",
          score: 95,
          classification_label: "A-Class"
        },
        {
          product_id: "P004",
          location_id: "L002",
          lead_time_category: "medium",
          variability_level: "low",
          criticality: "low",
          score: 45,
          classification_label: "C-Class"
        },
        {
          product_id: "P005",
          location_id: "L003",
          lead_time_category: "short",
          variability_level: "medium",
          criticality: "medium",
          score: 75,
          classification_label: "B-Class"
        }
      ];

      // Check if table is empty first
      const { count } = await supabase
        .from('product_classification')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        await supabase.from('product_classification').insert(sampleData);
        toast({
          title: "Sample data generated",
          description: "Sample SKU classifications have been created",
        });
        await refreshClassifications();
      } else {
        toast({
          title: "Data exists",
          description: "The classification table already has data",
        });
      }
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast({
        title: "Error",
        description: "Failed to generate sample data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>SKU Classification</CardTitle>
              <CardDescription>
                Classify SKUs based on lead time, variability, and criticality
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={generateSampleData}
              >
                Generate Sample Data
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-0">
          <div className="px-6 mb-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                placeholder="Search by SKU" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredClassifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No classifications available</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                No SKU classifications found. Classifications help optimize inventory levels based on item characteristics.
              </p>
              <Button onClick={generateSampleData}>
                Generate Sample Data
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Variability</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClassifications.map((item) => (
                    <TableRow key={`${item.sku}-${item.location_id}`}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.location_id}</TableCell>
                      <TableCell>
                        <Badge className={getLeadTimeColor(item.classification?.leadTimeCategory)}>
                          {item.classification?.leadTimeCategory || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getVariabilityColor(item.classification?.variabilityLevel)}>
                          {item.classification?.variabilityLevel || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCriticalityColor(item.classification?.criticality)}>
                          {item.classification?.criticality || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.classification?.score ? (
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                item.classification.score >= 80 ? 'bg-red-500' : 
                                item.classification.score >= 60 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${item.classification.score}%` }}
                            ></div>
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{item.category || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
