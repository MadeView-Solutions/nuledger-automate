import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Container from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectionStatus from "@/components/migration-sync/ConnectionStatus";
import DataImportOptions from "@/components/migration-sync/DataImportOptions";
import FieldMappingTool from "@/components/migration-sync/FieldMappingTool";
import DataValidationReport from "@/components/migration-sync/DataValidationReport";
import AuditLogs from "@/components/migration-sync/AuditLogs";

const MigrationSync = () => {
  const [activeTab, setActiveTab] = useState("connection");

  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Migration & Sync</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive data migration and synchronization with Filevine
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="connection">Connection Status</TabsTrigger>
            <TabsTrigger value="import">Data Import</TabsTrigger>
            <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
            <TabsTrigger value="validation">Validation Report</TabsTrigger>
            <TabsTrigger value="audit">Audit & Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <ConnectionStatus />
          </TabsContent>
          
          <TabsContent value="import">
            <DataImportOptions />
          </TabsContent>
          
          <TabsContent value="mapping">
            <FieldMappingTool />
          </TabsContent>
          
          <TabsContent value="validation">
            <DataValidationReport />
          </TabsContent>
          
          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default MigrationSync;