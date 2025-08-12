
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientsList from "@/components/clients/ClientsList";
import ClientDetails from "@/components/clients/ClientDetails";
import ClientOverviewTable from "@/components/clients/ClientOverviewTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TableProperties } from "lucide-react";
import { Client } from "@/types/client";
import { mockClients } from "@/data/mockClients";

const Clients = () => {
  const { id } = useParams();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("clients");

  // When a client ID is passed in the URL, fetch and display that client
  React.useEffect(() => {
    if (id) {
      // Find the client in mock data when ID changes
      const client = mockClients.find(c => c.id === id);
      if (client) {
        setSelectedClient(client);
        setActiveTab("clients"); // Switch to clients tab when viewing individual client
      }
    }
  }, [id]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Client Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Client Details
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TableProperties className="w-4 h-4" />
              Case Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ClientsList 
                  onSelectClient={setSelectedClient} 
                  selectedClientId={selectedClient?.id} 
                />
              </div>
              
              <div className="lg:col-span-2">
                {selectedClient ? (
                  <ClientDetails client={selectedClient} />
                ) : (
                  <div className="bg-muted/20 border border-border rounded-lg p-8 h-full flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">No Client Selected</h3>
                      <p className="text-muted-foreground">
                        Select a client from the list or add a new client to view details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <ClientOverviewTable />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
