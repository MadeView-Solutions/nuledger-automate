
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SecurityMeasures from "@/components/security/SecurityMeasures";
import FraudDetection from "@/components/security/FraudDetection";

const Settings = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Settings & Security</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="integrations">API Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Profile settings will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="space-y-8">
              <SecurityMeasures />
              <FraudDetection />
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Preferences settings will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="text-center py-16">
              <p className="text-muted-foreground">API keys will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default Settings;
