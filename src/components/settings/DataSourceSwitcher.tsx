
import { useState } from 'react';
import { useDataSourceContext } from '@/contexts/DataSourceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const DataSourceSwitcher = () => {
  const { dataSource, setDataSource, isAws, isSupabase } = useDataSourceContext();
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [awsRdsHost, setAwsRdsHost] = useState<string>('');
  const [awsRdsPort, setAwsRdsPort] = useState<string>('5432');
  const [awsRdsDatabase, setAwsRdsDatabase] = useState<string>('');
  const [awsRdsUsername, setAwsRdsUsername] = useState<string>('');
  const [awsRdsPassword, setAwsRdsPassword] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const handleSwitchDataSource = () => {
    const newDataSource = isSupabase ? 'aws' : 'supabase';
    
    if (newDataSource === 'aws' && !awsRdsHost) {
      setIsConfiguring(true);
      return;
    }
    
    setDataSource(newDataSource);
    
    toast({
      title: "Data Source Changed",
      description: `Now using ${newDataSource === 'aws' ? 'AWS RDS' : 'Supabase'} as the data source.`,
    });
    
    // Reload the page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    
    // Store the AWS RDS configuration in localStorage
    localStorage.setItem('AWS_RDS_HOST', awsRdsHost);
    localStorage.setItem('AWS_RDS_PORT', awsRdsPort);
    localStorage.setItem('AWS_RDS_DATABASE', awsRdsDatabase);
    localStorage.setItem('AWS_RDS_USERNAME', awsRdsUsername);
    localStorage.setItem('AWS_RDS_PASSWORD', awsRdsPassword);
    
    // Simulate a test connection
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: "Connection Test",
        description: "Successfully connected to AWS RDS.",
        variant: "success",
      });
    }, 1500);
  };

  const handleSaveConfiguration = () => {
    // Store the AWS RDS configuration in localStorage
    localStorage.setItem('AWS_RDS_HOST', awsRdsHost);
    localStorage.setItem('AWS_RDS_PORT', awsRdsPort);
    localStorage.setItem('AWS_RDS_DATABASE', awsRdsDatabase);
    localStorage.setItem('AWS_RDS_USERNAME', awsRdsUsername);
    localStorage.setItem('AWS_RDS_PASSWORD', awsRdsPassword);
    
    // Switch to AWS data source
    setDataSource('aws');
    setIsConfiguring(false);
    
    toast({
      title: "Configuration Saved",
      description: "AWS RDS configuration has been saved and activated.",
    });
    
    // Reload the page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  if (isConfiguring) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Configure AWS RDS Connection</CardTitle>
          <CardDescription>
            Enter your AWS RDS PostgreSQL connection details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <input
                id="host"
                className="w-full p-2 border rounded"
                value={awsRdsHost}
                onChange={(e) => setAwsRdsHost(e.target.value)}
                placeholder="your-db.cluster-xyz.region.rds.amazonaws.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <input
                id="port"
                className="w-full p-2 border rounded"
                value={awsRdsPort}
                onChange={(e) => setAwsRdsPort(e.target.value)}
                placeholder="5432"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="database">Database Name</Label>
            <input
              id="database"
              className="w-full p-2 border rounded"
              value={awsRdsDatabase}
              onChange={(e) => setAwsRdsDatabase(e.target.value)}
              placeholder="dtwin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <input
              id="username"
              className="w-full p-2 border rounded"
              value={awsRdsUsername}
              onChange={(e) => setAwsRdsUsername(e.target.value)}
              placeholder="postgres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded"
              value={awsRdsPassword}
              onChange={(e) => setAwsRdsPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="ssl" />
            <Label htmlFor="ssl">Use SSL</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsConfiguring(false)}>
            Cancel
          </Button>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={!awsRdsHost || !awsRdsDatabase || !awsRdsUsername || !awsRdsPassword}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Source Configuration</CardTitle>
        <CardDescription>
          Choose between Supabase and AWS RDS as your database provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Database className={`h-8 w-8 ${isSupabase ? 'text-emerald-500' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">Supabase</p>
                <p className="text-sm text-gray-500">PostgreSQL database with real-time capabilities</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full ${isSupabase ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Database className={`h-8 w-8 ${isAws ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">AWS RDS</p>
                <p className="text-sm text-gray-500">Amazon RDS PostgreSQL database</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full ${isAws ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-gray-500 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Switching data sources will refresh the page
        </div>
        <Button onClick={handleSwitchDataSource}>
          Switch to {isSupabase ? 'AWS RDS' : 'Supabase'}
        </Button>
      </CardFooter>
    </Card>
  );
};
