
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryItem } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BarChart2, 
  AlertTriangle, 
  Info,
  Layers,
  Clock,
  FileBarChart,
  Droplets
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabaseClient";

interface EnhancedInventoryTableProps {
  data: InventoryItem[];
  className?: string;
  priorityHighlight?: boolean;
}

const BufferVisualizer = ({ 
  min_stock_level, 
  max_stock_level, 
  safety_stock, 
  current_stock
}: { 
  min_stock_level: number, 
  max_stock_level: number, 
  safety_stock: number,
  current_stock: number
}) => {
  if (!min_stock_level || !max_stock_level) {
    return <div className="text-gray-500 italic">No buffer data</div>;
  }
  
  // Calculate buffer zones
  const redZone = safety_stock || 0;
  const yellowZone = min_stock_level - (safety_stock || 0);
  const greenZone = max_stock_level - min_stock_level;
  const totalBufferSize = max_stock_level;
  
  // Calculate percentages for visual representation
  const redPercent = (redZone / totalBufferSize) * 100;
  const yellowPercent = (yellowZone / totalBufferSize) * 100;
  const greenPercent = (greenZone / totalBufferSize) * 100;
  
  // Calculate current stock position as percentage
  const stockPercent = Math.min(100, (current_stock / totalBufferSize) * 100);
  
  // Determine color based on current stock position
  let statusColor = "bg-gray-200";
  if (current_stock <= safety_stock) {
    statusColor = "bg-red-500";
  } else if (current_stock <= min_stock_level) {
    statusColor = "bg-yellow-500";
  } else if (current_stock <= max_stock_level) {
    statusColor = "bg-green-500";
  } else {
    statusColor = "bg-blue-500"; // Over max stock level
  }
  
  return (
    <div className="w-full">
      <div className="flex mb-1 text-xs justify-between">
        <span>{current_stock} units</span>
        <span>{(stockPercent).toFixed(0)}% of max</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
        {/* Buffer zones colored background */}
        <div className="absolute top-0 left-0 h-full bg-red-200" style={{ width: `${redPercent}%` }}></div>
        <div className="absolute top-0 left-0 h-full bg-yellow-200" style={{ width: `${redPercent + yellowPercent}%`, left: `${redPercent}%` }}></div>
        <div className="absolute top-0 left-0 h-full bg-green-200" style={{ width: `${greenPercent}%`, left: `${redPercent + yellowPercent}%` }}></div>
        
        {/* Current stock position indicator */}
        <div className={`absolute top-0 h-full ${statusColor} transition-all duration-300`} style={{ width: `${stockPercent}%` }}></div>
        
        {/* Zone dividers */}
        <div className="absolute top-0 w-px h-full bg-gray-500" style={{ left: `${redPercent}%` }}></div>
        <div className="absolute top-0 w-px h-full bg-gray-500" style={{ left: `${redPercent + yellowPercent}%` }}></div>
      </div>
      <div className="flex text-xs justify-between mt-1">
        <span className="text-red-500">Safety: {safety_stock}</span>
        <span className="text-yellow-500">Min: {min_stock_level}</span>
        <span className="text-green-500">Max: {max_stock_level}</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: 'green' | 'yellow' | 'red' }) => {
  switch (status) {
    case 'green':
      return <Badge className="bg-green-500">Green</Badge>;
    case 'yellow':
      return <Badge className="bg-yellow-500">Yellow</Badge>;
    case 'red':
      return <Badge className="bg-red-500 text-white">Red</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const formatScore = (score: number) => {
  if (score >= 80) return { text: "High", color: "text-red-500" };
  if (score >= 50) return { text: "Medium", color: "text-yellow-500" };
  return { text: "Low", color: "text-green-500" };
};

export function EnhancedInventoryTable({ data, className, priorityHighlight = false }: EnhancedInventoryTableProps) {
  const [productDetails, setProductDetails] = useState<Record<string, { product_id: string, name: string, product_family: string }>>({});
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      // Extract unique product IDs
      const productIds = [...new Set(data.map(item => item.product_id))];
      
      if (productIds.length === 0) return;
      
      try {
        const { data: products, error } = await supabase
          .from('product_master')
          .select('product_id, name, product_family')
          .in('product_id', productIds);
          
        if (error) throw error;
        
        // Create a lookup map for easy access
        const productMap: Record<string, { product_id: string, name: string, product_family: string }> = {};
        products.forEach(product => {
          productMap[product.product_id] = product;
        });
        
        setProductDetails(productMap);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    
    fetchProductDetails();
  }, [data]);
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <Layers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No inventory data available</h3>
        <p className="text-gray-500">There is no inventory data to display at this time.</p>
      </div>
    );
  }
  
  const isPriority = (item: InventoryItem) => {
    const stockRatio = item.quantity_on_hand && item.max_stock_level 
      ? item.quantity_on_hand / item.max_stock_level 
      : 1;
    return stockRatio < 0.5;
  };
  
  return (
    <TooltipProvider>
      <div className={`rounded-md border ${className}`}>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-gray-50">
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">SKU / Name</TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    <span>Product Family</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4" />
                    <span>Current Stock</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    <FileBarChart className="h-4 w-4" />
                    <span>Buffer Visualization</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Lead Time</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" />
                    <span>Variability</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const productDetail = productDetails[item.product_id] || { name: 'Unknown', product_family: 'Unknown', product_id: item.product_id };
                const hasProductDetail = item.product_id in productDetails;
                const itemIsPriority = isPriority(item);
                const rowHighlightClass = priorityHighlight && itemIsPriority ? 'bg-amber-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50');
                
                return (
                  <TableRow 
                    key={item.id || index} 
                    className={`${rowHighlightClass} transition-colors hover:bg-blue-50`}
                  >
                    <TableCell>
                      {itemIsPriority ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Priority</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This item needs attention - stock level is below 50%</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.product_id}</div>
                        <div className="text-gray-500 text-sm">
                          {hasProductDetail ? productDetail.name : "Loading..."}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {hasProductDetail ? (
                        <Badge variant="outline" className="bg-blue-50">
                          {productDetail.product_family || item.productFamily || "Unknown"}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Loading...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{item.quantity_on_hand || 0}</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p>Available: {item.available_qty || item.quantity_on_hand || 0}</p>
                              <p>Reserved: {item.reserved_qty || 0}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[300px]">
                      <BufferVisualizer 
                        min_stock_level={item.min_stock_level || 0}
                        max_stock_level={item.max_stock_level || 0}
                        safety_stock={item.safety_stock || 0}
                        current_stock={item.quantity_on_hand || 0}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          item.lead_time_days > 30 
                            ? "bg-red-50 text-red-800 border-red-200" 
                            : item.lead_time_days > 15 
                            ? "bg-yellow-50 text-yellow-800 border-yellow-200" 
                            : "bg-green-50 text-green-800 border-green-200"
                        }
                      >
                        {item.lead_time_days > 30 
                          ? "Long" 
                          : item.lead_time_days > 15 
                          ? "Medium" 
                          : "Short"} 
                        ({item.lead_time_days || 0} days)
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          item.demand_variability > 1 
                            ? "bg-red-50 text-red-800 border-red-200" 
                            : item.demand_variability > 0.5 
                            ? "bg-yellow-50 text-yellow-800 border-yellow-200" 
                            : "bg-green-50 text-green-800 border-green-200"
                        }
                      >
                        {item.demand_variability > 1 
                          ? "High" 
                          : item.demand_variability > 0.5 
                          ? "Medium" 
                          : "Low"} 
                        ({item.demand_variability?.toFixed(2) || 0})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>
                        {item.location_id || "N/A"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
