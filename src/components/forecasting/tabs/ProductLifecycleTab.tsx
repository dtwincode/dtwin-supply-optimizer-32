
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from "recharts";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  FileQuestion, 
  Rocket, 
  ArrowUp, 
  BarChart2, 
  TrendingDown, 
  HelpCircle 
} from "lucide-react";

// Sample data for demonstration
const lifecycleStages = [
  { id: "new", name: "New Product Introduction", icon: Rocket, color: "bg-blue-500" },
  { id: "growth", name: "Growth", icon: ArrowUp, color: "bg-green-500" },
  { id: "mature", name: "Maturity", icon: BarChart2, color: "bg-yellow-500" },
  { id: "decline", name: "Decline", icon: TrendingDown, color: "bg-red-500" },
];

const sampleProducts = [
  { 
    id: "prod1", 
    sku: "SKU-001", 
    name: "Smart Watch X1", 
    stage: "new", 
    launchDate: "2024-06-15",
    category: "Electronics",
    salesTarget: 5000,
    confidence: 75,
    similarProducts: ["SKU-055", "SKU-042"],
    forecastMethod: "analogous"
  },
  { 
    id: "prod2", 
    sku: "SKU-002", 
    name: "Bluetooth Headphones", 
    stage: "growth", 
    launchDate: "2023-10-10",
    category: "Audio",
    salesTarget: 12000,
    confidence: 85,
    similarProducts: ["SKU-034"],
    forecastMethod: "time-series"
  },
  { 
    id: "prod3", 
    sku: "SKU-003", 
    name: "Smartphone Case", 
    stage: "mature", 
    launchDate: "2022-05-22",
    category: "Accessories",
    salesTarget: 20000,
    confidence: 92,
    similarProducts: [],
    forecastMethod: "time-series"
  },
  { 
    id: "prod4", 
    sku: "SKU-004", 
    name: "Tablet Pro 10", 
    stage: "decline", 
    launchDate: "2021-03-15",
    category: "Electronics",
    salesTarget: 3000,
    confidence: 88,
    similarProducts: [],
    forecastMethod: "time-series"
  },
  { 
    id: "prod5", 
    sku: "SKU-005", 
    name: "Smart Speaker", 
    stage: "new", 
    launchDate: "2024-05-30",
    category: "Smart Home",
    salesTarget: 8000,
    confidence: 70,
    similarProducts: ["SKU-078", "SKU-062"],
    forecastMethod: "analogous"
  },
];

// Sample data for charts
const lifecycleDistributionData = [
  { name: "New", count: 45 },
  { name: "Growth", count: 87 },
  { name: "Mature", count: 134 },
  { name: "Decline", count: 22 },
];

const salesTrendData = [
  { month: "Jan", new: 120, growth: 240, mature: 500, decline: 80 },
  { month: "Feb", new: 150, growth: 260, mature: 490, decline: 70 },
  { month: "Mar", new: 180, growth: 290, mature: 510, decline: 65 },
  { month: "Apr", new: 220, growth: 310, mature: 505, decline: 60 },
  { month: "May", new: 250, growth: 340, mature: 500, decline: 50 },
  { month: "Jun", new: 280, growth: 380, mature: 495, decline: 45 },
];

const ProductLifecycleTab = () => {
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("overview");

  // Filter products based on selected stage
  const filteredProducts = sampleProducts.filter(product => 
    selectedStage === "all" || product.stage === selectedStage
  );

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    setCurrentView("detail");
  };

  const selectedProductData = selectedProduct 
    ? sampleProducts.find(p => p.id === selectedProduct) 
    : null;

  // Sample forecast data for product detail
  const productForecastData = [
    { month: "Jul", forecast: 420, actual: 410 },
    { month: "Aug", forecast: 450, actual: 455 },
    { month: "Sep", forecast: 480, actual: 472 },
    { month: "Oct", forecast: 510, actual: null },
    { month: "Nov", forecast: 540, actual: null },
    { month: "Dec", forecast: 570, actual: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Lifecycle Management</h2>
        <div className="flex space-x-2">
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {lifecycleStages.map(stage => (
                <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMethod} onValueChange={setSelectedMethod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Forecast method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="time-series">Time Series</SelectItem>
              <SelectItem value="analogous">Analogous</SelectItem>
              <SelectItem value="judgmental">Judgmental</SelectItem>
              <SelectItem value="market-based">Market-based</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => setCurrentView(currentView === "overview" ? "overview" : "overview")}>
            {currentView === "detail" ? "Back to Overview" : "Refresh"}
          </Button>
        </div>
      </div>

      {currentView === "overview" ? (
        <div className="space-y-6">
          {/* Lifecycle stages cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {lifecycleStages.map(stage => {
              const count = sampleProducts.filter(p => p.stage === stage.id).length;
              const Icon = stage.icon;
              return (
                <Card key={stage.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${stage.color} text-white`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-medium">{stage.name}</h3>
                        <p className="text-2xl font-bold">{count} Products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Lifecycle Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lifecycleDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Number of Products" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Trends by Lifecycle Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="new" stroke="#3b82f6" name="New" />
                      <Line type="monotone" dataKey="growth" stroke="#22c55e" name="Growth" />
                      <Line type="monotone" dataKey="mature" stroke="#eab308" name="Mature" />
                      <Line type="monotone" dataKey="decline" stroke="#ef4444" name="Decline" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products by Lifecycle Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Lifecycle Stage</TableHead>
                    <TableHead>Launch Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Forecast Method</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            product.stage === "new" ? "bg-blue-500" :
                            product.stage === "growth" ? "bg-green-500" :
                            product.stage === "mature" ? "bg-yellow-500" :
                            "bg-red-500"
                          }
                        >
                          {product.stage === "new" ? "New" :
                           product.stage === "growth" ? "Growth" :
                           product.stage === "mature" ? "Mature" :
                           "Decline"}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.launchDate}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.forecastMethod}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{product.confidence}%</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${product.confidence > 80 ? 'bg-green-500' : product.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${product.confidence}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleProductSelect(product.id)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Product Detail View
        selectedProductData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedProductData.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedProductData.sku}</p>
                  </div>
                  <Badge 
                    className={
                      selectedProductData.stage === "new" ? "bg-blue-500" :
                      selectedProductData.stage === "growth" ? "bg-green-500" :
                      selectedProductData.stage === "mature" ? "bg-yellow-500" :
                      "bg-red-500"
                    }
                  >
                    {selectedProductData.stage === "new" ? "New Product" :
                     selectedProductData.stage === "growth" ? "Growth" :
                     selectedProductData.stage === "mature" ? "Mature" :
                     "Decline"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Product Details</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <p className="font-medium">{selectedProductData.category}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Launch Date:</span>
                          <p className="font-medium">{selectedProductData.launchDate}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Sales Target:</span>
                          <p className="font-medium">{selectedProductData.salesTarget.toLocaleString()} units</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Forecast Method:</span>
                          <p className="font-medium">{selectedProductData.forecastMethod}</p>
                        </div>
                      </div>
                    </div>

                    {selectedProductData.similarProducts.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Similar Products</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProductData.similarProducts.map(sku => (
                            <Badge key={sku} variant="outline">{sku}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Lifecycle Transition Planning</h3>
                      <div className="mt-2 p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Current Stage:</span>
                          <Badge 
                            className={
                              selectedProductData.stage === "new" ? "bg-blue-500" :
                              selectedProductData.stage === "growth" ? "bg-green-500" :
                              selectedProductData.stage === "mature" ? "bg-yellow-500" :
                              "bg-red-500"
                            }
                          >
                            {selectedProductData.stage === "new" ? "New Product" :
                             selectedProductData.stage === "growth" ? "Growth" :
                             selectedProductData.stage === "mature" ? "Mature" :
                             "Decline"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <RadioGroup defaultValue={selectedProductData.stage} className="flex space-x-2">
                            {lifecycleStages.map(stage => (
                              <div key={stage.id} className="flex items-center space-x-1">
                                <RadioGroupItem value={stage.id} id={`stage-${stage.id}`} />
                                <Label htmlFor={`stage-${stage.id}`} className="text-xs">{stage.name.split(' ')[0]}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Planned transition date:</Label>
                            <Input type="date" className="w-40 h-8 text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Forecast vs Actual Performance</h3>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={productForecastData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="forecast" stroke="#3b82f6" name="Forecast" strokeWidth={2} />
                          <Line type="monotone" dataKey="actual" stroke="#22c55e" name="Actual" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="forecast">
              <TabsList>
                <TabsTrigger value="forecast">Forecasting</TabsTrigger>
                <TabsTrigger value="transition">Transition Planning</TabsTrigger>
                <TabsTrigger value="insights">Analytics & Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="forecast" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Forecast Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Forecast Method</Label>
                          <Select defaultValue={selectedProductData.forecastMethod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="time-series">Time Series</SelectItem>
                              <SelectItem value="analogous">Analogous Products</SelectItem>
                              <SelectItem value="judgmental">Judgmental</SelectItem>
                              <SelectItem value="market-based">Market-based</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {selectedProductData.forecastMethod === "analogous" && (
                          <div className="space-y-2">
                            <Label>Reference Products</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProductData.similarProducts.map(sku => (
                                <Badge key={sku}>{sku} <button className="ml-1">×</button></Badge>
                              ))}
                              <Button variant="outline" size="sm" className="h-6">Add</Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label>Forecast Horizon</Label>
                          <Select defaultValue="6">
                            <SelectTrigger>
                              <SelectValue placeholder="Select horizon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 months</SelectItem>
                              <SelectItem value="6">6 months</SelectItem>
                              <SelectItem value="12">12 months</SelectItem>
                              <SelectItem value="18">18 months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Seasonality Pattern</Label>
                          <Select defaultValue="auto">
                            <SelectTrigger>
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="auto">Auto-detect</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Confidence Level</Label>
                            <span className="text-sm font-medium">{selectedProductData.confidence}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${selectedProductData.confidence > 80 ? 'bg-green-500' : selectedProductData.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${selectedProductData.confidence}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Sales Target</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type="number" 
                              defaultValue={selectedProductData.salesTarget} 
                            />
                            <span>units</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Adjustment Factors</Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Market Growth</span>
                              <Input type="number" defaultValue={5} className="w-20 h-8" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Cannibalization</span>
                              <Input type="number" defaultValue={-2} className="w-20 h-8" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Promotions</span>
                              <Input type="number" defaultValue={8} className="w-20 h-8" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6 space-x-2">
                      <Button variant="outline">Reset</Button>
                      <Button>Update Forecast</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transition" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lifecycle Transition Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Current Lifecycle Stage</h3>
                          <Badge 
                            className={
                              selectedProductData.stage === "new" ? "bg-blue-500" :
                              selectedProductData.stage === "growth" ? "bg-green-500" :
                              selectedProductData.stage === "mature" ? "bg-yellow-500" :
                              "bg-red-500"
                            }
                          >
                            {selectedProductData.stage === "new" ? "New Product" :
                             selectedProductData.stage === "growth" ? "Growth" :
                             selectedProductData.stage === "mature" ? "Mature" :
                             "Decline"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-medium">Transition Criteria Met</h3>
                          <Badge variant="outline" className="bg-yellow-100">2 of 3</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Stage Transition Timeline</h3>
                        <div className="relative">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: "25%" }} />
                          </div>
                          <div className="flex justify-between mt-2">
                            <div className="text-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto" />
                              <span className="text-xs">NPI</span>
                            </div>
                            <div className="text-center">
                              <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto" />
                              <span className="text-xs">Growth</span>
                            </div>
                            <div className="text-center">
                              <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto" />
                              <span className="text-xs">Mature</span>
                            </div>
                            <div className="text-center">
                              <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto" />
                              <span className="text-xs">Decline</span>
                            </div>
                            <div className="text-center">
                              <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto" />
                              <span className="text-xs">EOL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Transition Criteria</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Criteria</TableHead>
                              <TableHead>Threshold</TableHead>
                              <TableHead>Current Value</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Market Penetration</TableCell>
                              <TableCell>5%</TableCell>
                              <TableCell>6.2%</TableCell>
                              <TableCell><Badge className="bg-green-500">Met</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Growth Rate</TableCell>
                              <TableCell>15% monthly</TableCell>
                              <TableCell>12.5%</TableCell>
                              <TableCell><Badge className="bg-yellow-500">Partial</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Time in Stage</TableCell>
                              <TableCell>90 days</TableCell>
                              <TableCell>45 days</TableCell>
                              <TableCell><Badge className="bg-red-500">Not Met</Badge></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Planned Transition</h3>
                        <div className="flex items-end space-x-4">
                          <div className="space-y-1">
                            <Label>Target Stage</Label>
                            <Select defaultValue="growth">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select stage" />
                              </SelectTrigger>
                              <SelectContent>
                                {lifecycleStages.map(stage => (
                                  <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1">
                            <Label>Planned Date</Label>
                            <Input type="date" defaultValue="2024-09-15" />
                          </div>
                          
                          <Button>Schedule Transition</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-sm font-medium text-muted-foreground">Growth Rate</h3>
                              <p className="text-2xl font-bold text-green-500">+18.5%</p>
                              <p className="text-xs text-muted-foreground">vs 15% average for category</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-sm font-medium text-muted-foreground">Market Share</h3>
                              <p className="text-2xl font-bold">4.2%</p>
                              <p className="text-xs text-green-500">+0.8% from last period</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-sm font-medium text-muted-foreground">Forecast Accuracy</h3>
                              <p className="text-2xl font-bold">92.7%</p>
                              <p className="text-xs text-green-500">Above 85% target</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-4">Recommendations</h3>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-md">
                            <FileQuestion className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Consider transition to Growth stage</h4>
                              <p className="text-sm text-muted-foreground">
                                Based on current sales velocity and market penetration, this product is showing strong
                                indicators for transition to Growth stage within the next 30-45 days.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-md">
                            <FileQuestion className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Optimize inventory strategy</h4>
                              <p className="text-sm text-muted-foreground">
                                Consider increasing safety stock by 15% to support accelerating demand pattern
                                and avoid stockouts during promotional periods.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-4">Similar Products Performance</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Stage</TableHead>
                              <TableHead>Growth Rate</TableHead>
                              <TableHead>Time in Stage</TableHead>
                              <TableHead>Forecast Accuracy</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProductData.similarProducts.map((sku, idx) => (
                              <TableRow key={sku}>
                                <TableCell>{sku}</TableCell>
                                <TableCell>
                                  <Badge 
                                    className={idx === 0 ? "bg-green-500" : "bg-blue-500"}
                                  >
                                    {idx === 0 ? "Growth" : "New"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{idx === 0 ? "+22.4%" : "+16.8%"}</TableCell>
                                <TableCell>{idx === 0 ? "120 days" : "75 days"}</TableCell>
                                <TableCell>{idx === 0 ? "88.5%" : "84.3%"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )
      )}
    </div>
  );
};

export default ProductLifecycleTab;
