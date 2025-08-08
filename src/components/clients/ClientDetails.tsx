import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";
import ClientDocuments from "./ClientDocuments";
import ClientWorkflow from "./ClientWorkflow";
import ClientUpcomingDeadlines from "./ClientUpcomingDeadlines";
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
          {/* Case Overview Section */}
          {client.caseInfo && (
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-4 text-primary">Case Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground">Case Manager</h4>
                  <p className="text-sm font-medium">{client.caseInfo.caseManager}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground">Date of Loss</h4>
                  <p className="text-sm font-medium">
                    {new Date(client.caseInfo.dateOfLoss).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground">Date Settled</h4>
                  <p className="text-sm font-medium">
                    {client.caseInfo.dateSettled 
                      ? new Date(client.caseInfo.dateSettled).toLocaleDateString()
                      : 'Pending'
                    }
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground">Case Type</h4>
                  <p className="text-sm font-medium capitalize">
                    {client.caseInfo.caseType.replace('-', ' ')}
                  </p>
                </div>
              </div>
              
              {(client.caseInfo.claimAmount || client.caseInfo.settlementAmount) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary/20">
                  {client.caseInfo.claimAmount && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium uppercase text-muted-foreground">Claim Amount</h4>
                      <p className="text-lg font-semibold text-primary">
                        ${client.caseInfo.claimAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {client.caseInfo.settlementAmount && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium uppercase text-muted-foreground">Settlement Amount</h4>
                      <p className="text-lg font-semibold text-green-600">
                        ${client.caseInfo.settlementAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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

          {/* Upcoming Deadlines Section */}
          <ClientUpcomingDeadlines client={client} />

          <Tabs defaultValue="documents" className="mt-6">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="advisory">Advisory</TabsTrigger>
              <TabsTrigger value="audit">Audit Prep</TabsTrigger>
            </TabsList>
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
