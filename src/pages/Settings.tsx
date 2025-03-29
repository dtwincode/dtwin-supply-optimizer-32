
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileUploadTab } from "@/components/settings/FileUploadTab";
import { DataManagementTab } from "@/components/settings/DataManagementTab";
import { ApiKeysTab } from "@/components/settings/ApiKeysTab";
import { UsersTab } from "@/components/settings/UsersTab";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { BufferProfilesTab } from "@/components/settings/BufferProfilesTab";
import { UserSettingsTab } from "@/components/settings/UserSettingsTab";
import { SystemSettingsTab } from "@/components/settings/SystemSettingsTab";

export default function Settings() {
  const [currentTab, setCurrentTab] = useState("data-upload");
  
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
              <TabsTrigger value="data-upload" className="rounded-md px-3">
                Data Upload
              </TabsTrigger>
              <TabsTrigger value="data-management" className="rounded-md px-3">
                Data Management
              </TabsTrigger>
              <TabsTrigger value="buffer-profiles" className="rounded-md px-3">
                Buffer Profiles
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
          
          <TabsContent value="data-upload" className="space-y-4">
            <FileUploadTab />
          </TabsContent>
          
          <TabsContent value="data-management" className="space-y-4">
            <DataManagementTab />
          </TabsContent>
          
          <TabsContent value="buffer-profiles" className="space-y-4">
            <BufferProfilesTab />
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-4">
            <ApiKeysTab />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <UsersTab />
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <IntegrationsTab />
          </TabsContent>
          
          <TabsContent value="user-settings" className="space-y-4">
            <UserSettingsTab />
          </TabsContent>
          
          <TabsContent value="system-settings" className="space-y-4">
            <SystemSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
