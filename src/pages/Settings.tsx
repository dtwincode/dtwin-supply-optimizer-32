
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import ProductUpload from "@/components/settings/master_data_new/ProductUpload";
import VendorUpload from "@/components/settings/master_data_new/VendorUpload";
import LocationUpload from "@/components/settings/master_data_new/LocationUpload";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("master-data");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Add a handler for tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading data management...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto p-4 sm:p-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Management & Configuration</h2>
          <p className="text-muted-foreground mt-2">
            Configure system settings and manage data hierarchies across your organization
          </p>
        </div>

        <Separator className="my-6" />
        
        <Card className="p-4 sm:p-6">
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={handleTabChange} 
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
              <TabsTrigger value="master-data">Master Data</TabsTrigger>
              <TabsTrigger value="system-settings">System Settings</TabsTrigger>
              <TabsTrigger value="user-preferences">User Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="master-data" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProductUpload />
                <VendorUpload />
                <LocationUpload />
              </div>
            </TabsContent>

            <TabsContent value="system-settings" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                <p className="text-muted-foreground">Configure global system settings and preferences.</p>
              </Card>
            </TabsContent>

            <TabsContent value="user-preferences" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">User Preferences</h3>
                <p className="text-muted-foreground">Manage your personal preferences and settings.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
