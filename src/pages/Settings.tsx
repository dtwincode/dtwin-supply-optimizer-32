
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BufferProfilesTab } from "@/components/settings/BufferProfilesTab";

export default function Settings() {
  const [currentTab, setCurrentTab] = useState("buffer-profiles");
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <div className="overflow-auto">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-auto">
              <TabsTrigger value="buffer-profiles" className="rounded-md px-3">
                Buffer Profiles
              </TabsTrigger>
              <TabsTrigger value="data-upload" className="rounded-md px-3">
                Data Upload
              </TabsTrigger>
              <TabsTrigger value="data-management" className="rounded-md px-3">
                Data Management
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="rounded-md px-3">
                API Keys
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-md px-3">
                Users
              </TabsTrigger>
              <TabsTrigger value="integrations" className="rounded-md px-3">
                Integrations
              </TabsTrigger>
              <TabsTrigger value="user-settings" className="rounded-md px-3">
                User Settings
              </TabsTrigger>
              <TabsTrigger value="system-settings" className="rounded-md px-3">
                System Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="buffer-profiles" className="space-y-4">
            <BufferProfilesTab />
          </TabsContent>
          
          <TabsContent value="data-upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Upload</CardTitle>
                <CardDescription>Upload your data files here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Data upload functionality will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data-management" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your uploaded data</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Data management functionality will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys</CardDescription>
              </CardHeader>
              <CardContent>
                <p>API key management functionality will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management functionality will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Manage your integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Integration management functionality will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="user-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>Manage your user settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User settings functionality will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage your system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>System settings functionality will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
