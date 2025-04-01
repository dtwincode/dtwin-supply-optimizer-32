
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, PlusCircle, AlertTriangle, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DecouplingPoint {
  id: string;
  location_id: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  description?: string;
  created_at: string;
  updated_at: string;
  buffer_profile_id?: string;
}

interface NetworkNode {
  id: string;
  label: string;
  type: string;
  decouplingType?: string;
}

interface NetworkConnection {
  source: string;
  target: string;
  label?: string;
}

export function DecouplingTab() {
  const { toast } = useToast();
  const [decouplingPoints, setDecouplingPoints] = useState<DecouplingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPoint, setNewPoint] = useState({
    location_id: '',
    type: 'strategic' as const,
    description: '',
    buffer_profile_id: ''
  });
  const [locations, setLocations] = useState<{id: string; name: string}[]>([]);
  const [bufferProfiles, setBufferProfiles] = useState<{id: string; name: string}[]>([]);
  const [networkView, setNetworkView] = useState<{
    nodes: NetworkNode[];
    connections: NetworkConnection[];
  }>({
    nodes: [],
    connections: []
  });

  useEffect(() => {
    fetchDecouplingPoints();
    fetchLocations();
    fetchBufferProfiles();
  }, []);

  const fetchDecouplingPoints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('decoupling_points')
        .select('*');

      if (error) throw error;

      setDecouplingPoints(data || []);
      
      // Generate network data from points
      generateNetworkView(data || []);
    } catch (error) {
      console.error("Error fetching decoupling points:", error);
      toast({
        title: "Error",
        description: "Failed to load decoupling points",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await supabase
        .from('location_master')
        .select('location_id, warehouse');
      
      if (data) {
        setLocations(data.map(loc => ({
          id: loc.location_id,
          name: `${loc.warehouse} (${loc.location_id})`
        })));
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchBufferProfiles = async () => {
    try {
      const { data } = await supabase
        .from('buffer_profiles')
        .select('id, name');
      
      if (data) {
        setBufferProfiles(data.map(profile => ({
          id: profile.id,
          name: profile.name
        })));
      }
    } catch (error) {
      console.error("Error fetching buffer profiles:", error);
    }
  };

  const generateNetworkView = (points: DecouplingPoint[]) => {
    // For simplicity, create sample network view
    // In a real app, this would involve analyzing the connections between points
    
    // Create nodes from decoupling points
    let nodes: NetworkNode[] = points.map(point => ({
      id: point.id,
      label: `${point.location_id} (${point.type})`,
      type: 'decoupling',
      decouplingType: point.type
    }));
    
    // Add some regular nodes
    const regularNodes: NetworkNode[] = [
      { id: 'supplier-1', label: 'Supplier A', type: 'supplier' },
      { id: 'supplier-2', label: 'Supplier B', type: 'supplier' },
      { id: 'customer-1', label: 'Customer Zone 1', type: 'customer' },
      { id: 'customer-2', label: 'Customer Zone 2', type: 'customer' }
    ];
    
    nodes = [...nodes, ...regularNodes];
    
    // Create some connections
    // This is simplified - in real app, these would be created based on actual flow data
    const connections: NetworkConnection[] = [];
    
    // Connect suppliers to first decoupling point if any exist
    if (points.length > 0) {
      connections.push(
        { source: 'supplier-1', target: points[0].id, label: 'supplies' }
      );
      
      if (points.length > 1) {
        connections.push(
          { source: 'supplier-2', target: points[1].id, label: 'supplies' }
        );
        
        // Connect decoupling points to each other
        connections.push(
          { source: points[0].id, target: points[1].id, label: 'transfers' }
        );
        
        // Connect to customers
        connections.push(
          { source: points[1].id, target: 'customer-1', label: 'serves' }
        );
      }
      
      connections.push(
        { source: points[0].id, target: 'customer-2', label: 'serves' }
      );
    }
    
    setNetworkView({
      nodes,
      connections
    });
  };

  const handleAddPoint = async () => {
    try {
      if (!newPoint.location_id) {
        toast({
          title: "Missing information",
          description: "Please select a location",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('decoupling_points')
        .insert([
          {
            location_id: newPoint.location_id,
            type: newPoint.type,
            description: newPoint.description || null,
            buffer_profile_id: newPoint.buffer_profile_id || null
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Decoupling point added successfully"
      });

      setIsAddDialogOpen(false);
      setNewPoint({
        location_id: '',
        type: 'strategic',
        description: '',
        buffer_profile_id: ''
      });
      
      fetchDecouplingPoints();
    } catch (error) {
      console.error("Error adding decoupling point:", error);
      toast({
        title: "Error",
        description: "Failed to add decoupling point",
        variant: "destructive"
      });
    }
  };

  const handleDeletePoint = async (id: string) => {
    try {
      const { error } = await supabase
        .from('decoupling_points')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Decoupling point deleted successfully"
      });
      
      fetchDecouplingPoints();
    } catch (error) {
      console.error("Error deleting decoupling point:", error);
      toast({
        title: "Error",
        description: "Failed to delete decoupling point",
        variant: "destructive"
      });
    }
  };

  const generateSampleData = async () => {
    try {
      // First check if we have any locations
      if (locations.length === 0) {
        // Create some sample locations
        const locationData = [
          { location_id: 'L001', warehouse: 'Main Warehouse', city: 'Chicago', region: 'Midwest' },
          { location_id: 'L002', warehouse: 'Distribution Center', city: 'Dallas', region: 'South' },
          { location_id: 'L003', warehouse: 'Retail Store', city: 'New York', region: 'East' }
        ];
        
        await supabase.from('location_master').insert(locationData);
        
        // Refresh locations
        await fetchLocations();
      }
      
      // Then check if we have buffer profiles
      if (bufferProfiles.length === 0) {
        // Create some sample buffer profiles
        const profileData = [
          { id: 'BP001', name: 'Standard Profile', lead_time_factor: 1.0, variability_factor: 0.5 },
          { id: 'BP002', name: 'High Variability', lead_time_factor: 1.2, variability_factor: 0.8 }
        ];
        
        await supabase.from('buffer_profiles').insert(profileData);
        
        // Refresh buffer profiles
        await fetchBufferProfiles();
      }

      // Check if we have any decoupling points
      const { count } = await supabase
        .from('decoupling_points')
        .select('*', { count: 'exact', head: true });
      
      if (count === 0) {
        // Create sample decoupling points
        const decouplingData = [
          { 
            location_id: 'L001', 
            type: 'strategic', 
            description: 'Main strategic decoupling point',
            buffer_profile_id: 'BP001'
          },
          { 
            location_id: 'L002', 
            type: 'stock_point', 
            description: 'Distribution center stock point',
            buffer_profile_id: 'BP002'
          }
        ];
        
        await supabase.from('decoupling_points').insert(decouplingData);
        
        toast({
          title: "Sample data generated",
          description: "Sample decoupling points have been created"
        });
        
        fetchDecouplingPoints();
      } else {
        toast({
          title: "Data exists",
          description: "Decoupling points already exist"
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

  const getDecouplingTypeLabel = (type: string) => {
    switch (type) {
      case 'strategic': return 'Strategic';
      case 'customer_order': return 'Customer Order';
      case 'stock_point': return 'Stock Point';
      case 'intermediate': return 'Intermediate';
      default: return type;
    }
  };

  const getDecouplingTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'bg-blue-100 text-blue-800';
      case 'customer_order': return 'bg-green-100 text-green-800';
      case 'stock_point': return 'bg-purple-100 text-purple-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Decoupling Points</CardTitle>
              <CardDescription>Configure and manage decoupling points in your supply chain network</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchDecouplingPoints}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Decoupling Point
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Decoupling Point</DialogTitle>
                    <DialogDescription>
                      Configure a new decoupling point in your supply chain network
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select 
                        value={newPoint.location_id}
                        onValueChange={(value) => setNewPoint({...newPoint, location_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(loc => (
                            <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Decoupling Type</Label>
                      <Select 
                        value={newPoint.type}
                        onValueChange={(value: any) => setNewPoint({...newPoint, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strategic">Strategic</SelectItem>
                          <SelectItem value="customer_order">Customer Order</SelectItem>
                          <SelectItem value="stock_point">Stock Point</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="buffer-profile">Buffer Profile</Label>
                      <Select 
                        value={newPoint.buffer_profile_id}
                        onValueChange={(value) => setNewPoint({...newPoint, buffer_profile_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select buffer profile" />
                        </SelectTrigger>
                        <SelectContent>
                          {bufferProfiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>{profile.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description"
                        value={newPoint.description}
                        onChange={(e) => setNewPoint({...newPoint, description: e.target.value})}
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddPoint}>Add Decoupling Point</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-0">
          <Tabs defaultValue="list">
            <div className="px-6 mb-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="network">Network View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="list">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : decouplingPoints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No decoupling points found</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Decoupling points help optimize inventory positioning in your supply chain network.
                  </p>
                  <Button onClick={generateSampleData}>
                    Generate Sample Data
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Buffer Profile</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {decouplingPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">{point.location_id}</TableCell>
                          <TableCell>
                            <Badge className={getDecouplingTypeColor(point.type)}>
                              {getDecouplingTypeLabel(point.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{point.description || '-'}</TableCell>
                          <TableCell>{point.buffer_profile_id || '-'}</TableCell>
                          <TableCell>{new Date(point.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeletePoint(point.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="network">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : networkView.nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <Network className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">No network data available</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Add decoupling points to visualize your supply chain network.
                  </p>
                  <Button onClick={generateSampleData}>
                    Generate Sample Data
                  </Button>
                </div>
              ) : (
                <div className="px-6">
                  <Card className="border-dashed">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Supply Chain Network</h3>
                          <Badge variant="outline" className="px-2 py-1">
                            {networkView.nodes.length} nodes, {networkView.connections.length} connections
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          {networkView.nodes.map(node => (
                            <Card key={node.id} className="overflow-hidden">
                              <CardHeader className="py-3 px-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-medium">{node.label}</h4>
                                  <Badge 
                                    variant={node.type === 'decoupling' ? 'default' : 'outline'}
                                    className={
                                      node.type === 'decoupling' 
                                        ? getDecouplingTypeColor(node.decouplingType || 'strategic')
                                        : node.type === 'supplier' 
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : 'bg-teal-100 text-teal-800'
                                    }
                                  >
                                    {node.type === 'decoupling' 
                                      ? getDecouplingTypeLabel(node.decouplingType || 'strategic')
                                      : node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="py-2 px-4 bg-muted/30">
                                <div className="text-xs text-muted-foreground">
                                  {networkView.connections
                                    .filter(conn => conn.source === node.id)
                                    .map(conn => {
                                      const targetNode = networkView.nodes.find(n => n.id === conn.target);
                                      return (
                                        <div key={`${conn.source}-${conn.target}`} className="py-1">
                                          <span className="font-medium">Connects to:</span> {targetNode?.label || conn.target}
                                          {conn.label && <span className="ml-1 opacity-70">({conn.label})</span>}
                                        </div>
                                      );
                                    })}
                                  {networkView.connections
                                    .filter(conn => conn.target === node.id)
                                    .map(conn => {
                                      const sourceNode = networkView.nodes.find(n => n.id === conn.source);
                                      return (
                                        <div key={`${conn.source}-${conn.target}`} className="py-1">
                                          <span className="font-medium">Connected from:</span> {sourceNode?.label || conn.source}
                                          {conn.label && <span className="ml-1 opacity-70">({conn.label})</span>}
                                        </div>
                                      );
                                    })}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
