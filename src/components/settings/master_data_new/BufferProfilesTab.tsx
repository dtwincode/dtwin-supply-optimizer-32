
import React from "react";
import BufferProfilesUpload from "./BufferProfilesUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BufferProfilesTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Buffer Profiles</CardTitle>
          <CardDescription>
            View and manage buffer profiles for inventory management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BufferProfilesUpload />
        </CardContent>
      </Card>
    </div>
  );
};

export default BufferProfilesTab;
