
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, Database, Table, BarChart3, FileSpreadsheet, Filter, Clock } from "lucide-react";

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
          <TabsList>
            <TabsTrigger value="integrated">Integrated Data</TabsTrigger>
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
