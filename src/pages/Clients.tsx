
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientsList from "@/components/clients/ClientsList";
import ClientDetails from "@/components/clients/ClientDetails";
import { Client } from "@/types/client";

const Clients = () => {
  const { id } = useParams();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // When a client ID is passed in the URL, fetch and display that client
  React.useEffect(() => {
    if (id) {
      // Find the client in mock data when ID changes
      const client = mockClients.find(c => c.id === id);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [id]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Client Management</h1>
        
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
      </div>
    </DashboardLayout>
  );
};

export default Clients;
