
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, UserCheck, Building2, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockClients } from "@/data/mockClients";
import { Client } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AddClientDialog from "./AddClientDialog";

interface ClientsListProps {
  onSelectClient: (client: Client) => void;
  selectedClientId?: string;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  onSelectClient,
  selectedClientId
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();

  // Filter clients based on search query
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.businessName && client.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClientSelect = (client: Client) => {
    onSelectClient(client);
    navigate(`/clients/${client.id}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Clients</CardTitle>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className={cn(
                  "flex items-start p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
                  selectedClientId === client.id && "bg-muted"
                )}
                onClick={() => handleClientSelect(client)}
              >
                <div className="flex-shrink-0 mr-3">
                  {client.type === "business" ? (
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Building2 className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium truncate">{client.name}</h4>
                    <ClientStatusBadge status={client.status} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {client.type === "business" ? client.businessName : client.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(client.dateAdded).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No clients found</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <AddClientDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onClientAdded={(client) => {
          // This would normally save to backend
          // For now we just select the client
          onSelectClient(client);
        }}
      />
    </Card>
  );
};

// Helper component for status badges
const ClientStatusBadge = ({ status }: { status: Client['status'] }) => {
  if (status === 'active') {
    return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>;
  } else if (status === 'pending') {
    return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
  } else {
    return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
  }
};

export default ClientsList;
