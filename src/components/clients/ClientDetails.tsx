
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";
import ClientTasks from "./ClientTasks";
import ClientDocuments from "./ClientDocuments";
import ClientWorkflow from "./ClientWorkflow";
import ClientQuickBooksSync from "./ClientQuickBooksSync";
import BusinessAdvisoryDashboard from "../advisory/BusinessAdvisoryDashboard";
import AuditPreparationDashboard from "../audit/AuditPreparationDashboard";

interface ClientDetailsProps {
  client: Client;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{client.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Contact Information</h3>
              <p className="text-sm">Email: {client.email}</p>
              <p className="text-sm">Phone: {client.phone}</p>
              {client.type === 'business' && client.businessName && (
                <p className="text-sm">Business: {client.businessName}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Address</h3>
              <p className="text-sm">{client.address.street}</p>
              <p className="text-sm">
                {client.address.city}, {client.address.state} {client.address.zipCode}
              </p>
              <p className="text-sm">{client.address.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-muted rounded-md">
              <h3 className="text-xs font-medium uppercase text-muted-foreground">Client Type</h3>
              <p className="text-lg font-medium capitalize">{client.type}</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <h3 className="text-xs font-medium uppercase text-muted-foreground">Status</h3>
              <p className="text-lg font-medium capitalize">{client.status}</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <h3 className="text-xs font-medium uppercase text-muted-foreground">Added On</h3>
              <p className="text-lg font-medium">
                {new Date(client.dateAdded).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Add QuickBooks Sync Component */}
          <ClientQuickBooksSync client={client} />

          <Tabs defaultValue="tasks" className="mt-6">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="advisory">Advisory</TabsTrigger>
              <TabsTrigger value="audit">Audit Prep</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <ClientTasks client={client} />
            </TabsContent>
            <TabsContent value="documents">
              <ClientDocuments client={client} />
            </TabsContent>
            <TabsContent value="workflow">
              <ClientWorkflow client={client} />
            </TabsContent>
            <TabsContent value="advisory">
              <BusinessAdvisoryDashboard />
            </TabsContent>
            <TabsContent value="audit">
              <AuditPreparationDashboard />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetails;
