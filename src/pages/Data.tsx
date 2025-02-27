
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, Database, Table, BarChart3, FileSpreadsheet, Filter, Clock, Map, Package, TrendingUp } from "lucide-react";

const Data = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload New Data</span>
          </Button>
        </div>
        
        <Tabs defaultValue="integrated" className="space-y-4">
          <TabsList className="w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="integrated">Integrated Data</TabsTrigger>
            <TabsTrigger value="location">Location Hierarchy</TabsTrigger>
            <TabsTrigger value="product">Product Hierarchy</TabsTrigger>
            <TabsTrigger value="sales">Historical Sales</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="quality">Data Quality</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrated" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Total Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124,385</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last import</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Active Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Across 3 data domains</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Data Quality Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+5% from previous month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Integrated Data Overview</CardTitle>
                <CardDescription>View and manage all integrated data sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-6 bg-muted p-3">
                    <div className="font-medium">Data Domain</div>
                    <div className="font-medium">Records</div>
                    <div className="font-medium">Last Updated</div>
                    <div className="font-medium">Source Files</div>
                    <div className="font-medium">Quality Score</div>
                    <div className="font-medium text-right">Actions</div>
                  </div>
                  {['Sales History', 'Product Hierarchy', 'Location Hierarchy', 'Inventory Levels', 'Lead Times'].map((domain, i) => (
                    <div key={i} className="grid grid-cols-6 p-3 border-t">
                      <div className="font-medium">{domain}</div>
                      <div>{Math.floor(Math.random() * 50000)}</div>
                      <div>{new Date().toLocaleDateString()}</div>
                      <div>{Math.floor(Math.random() * 10) + 1}</div>
                      <div>{Math.floor(Math.random() * 15) + 85}%</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="location" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Location Hierarchy Management</CardTitle>
                <CardDescription>
                  Manage geographical and organizational locations for your supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Map className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">Location Structure</h3>
                      <p className="text-muted-foreground">Define regions, cities, warehouses, and channels</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">Upload Locations</Button>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-5 bg-muted p-3">
                    <div className="font-medium">Location Name</div>
                    <div className="font-medium">Type</div>
                    <div className="font-medium">Parent</div>
                    <div className="font-medium">Active Nodes</div>
                    <div className="font-medium text-right">Actions</div>
                  </div>
                  {['North America', 'Europe', 'Asia Pacific', 'Africa', 'South America'].map((region, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 border-t">
                      <div className="font-medium">{region}</div>
                      <div>Region</div>
                      <div>Global</div>
                      <div>{5 + i}</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="product" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Hierarchy Management</CardTitle>
                <CardDescription>
                  Manage categories, product lines, and SKUs across your product portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">Product Structure</h3>
                      <p className="text-muted-foreground">Define categories, families, models, and variants</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">Upload Products</Button>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-5 bg-muted p-3">
                    <div className="font-medium">Product Category</div>
                    <div className="font-medium">Level</div>
                    <div className="font-medium">Parent</div>
                    <div className="font-medium">SKU Count</div>
                    <div className="font-medium text-right">Actions</div>
                  </div>
                  {['Electronics', 'Appliances', 'Furniture', 'Clothing', 'Accessories'].map((category, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 border-t">
                      <div className="font-medium">{category}</div>
                      <div>Category</div>
                      <div>All Products</div>
                      <div>{Math.floor(Math.random() * 500) + 50}</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Sales Data</CardTitle>
                <CardDescription>
                  Manage and analyze your historical sales data for forecasting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">Sales History</h3>
                      <p className="text-muted-foreground">Import and manage historical sales data for analysis</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Download Template</Button>
                    <Button size="sm">Upload Sales Data</Button>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-5 bg-muted p-3">
                    <div className="font-medium">Data Set</div>
                    <div className="font-medium">Time Period</div>
                    <div className="font-medium">Record Count</div>
                    <div className="font-medium">Last Updated</div>
                    <div className="font-medium text-right">Actions</div>
                  </div>
                  {['Q1 2023 Sales', 'Q2 2023 Sales', 'Q3 2023 Sales', 'Q4 2023 Sales', 'Q1 2024 Sales'].map((period, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 border-t">
                      <div className="font-medium">{period}</div>
                      <div>{period.replace('Sales', '').trim()}</div>
                      <div>{Math.floor(Math.random() * 50000) + 10000}</div>
                      <div>{new Date(Date.now() - i * 7776000000).toLocaleDateString()}</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Source Management</CardTitle>
                <CardDescription>Manage connections to your data sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Configure your data sources and connections here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Monitoring</CardTitle>
                <CardDescription>Track and improve data quality across your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Data quality metrics and improvements will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Version History</CardTitle>
                <CardDescription>View and restore previous data versions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-5 bg-muted p-3">
                    <div className="font-medium">Version</div>
                    <div className="font-medium">Date</div>
                    <div className="font-medium">Created By</div>
                    <div className="font-medium">Changes</div>
                    <div className="font-medium text-right">Actions</div>
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 border-t">
                      <div className="font-medium">v{3 - (i * 0.1)}.0</div>
                      <div>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</div>
                      <div>System Admin</div>
                      <div>{Math.floor(Math.random() * 100) + 100} records updated</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Restore</Button>
                        <Button variant="ghost" size="sm">
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Data;
