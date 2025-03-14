
import React, { useState } from "react";
import { Building2, User, Phone, Mail, MapPin, ClipboardList, FileText, DollarSign, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from "@/types/client";
import ClientWorkflow from "./ClientWorkflow";
import ClientDocuments from "./ClientDocuments";
import ClientTasks from "./ClientTasks";

interface ClientDetailsProps {
  client: Client;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              client.type === "business" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-green-100 text-green-700"
            }`}>
              {client.type === "business" ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <CardTitle className="text-xl">{client.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {client.type === "business" ? client.businessName : "Individual Client"}
                </span>
                <ClientStatusBadge status={client.status} />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{client.address.street}</p>
                      <p>{client.address.city}, {client.address.state} {client.address.zipCode}</p>
                      <p>{client.address.country}</p>
                    </div>
                  </div>
                </div>
                
                {client.contacts && client.contacts.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-3">Additional Contacts</h3>
                    <div className="space-y-4">
                      {client.contacts.map((contact, index) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{contact.name}</span>
                            <Badge variant="outline">{contact.role}</Badge>
                          </div>
                          <div className="mt-1 text-sm space-y-1">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span>{contact.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{contact.phone}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Account Details</h3>
                  <div className="bg-muted/50 p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Client Since</span>
                      </div>
                      <span>{new Date(client.dateAdded).toLocaleDateString()}</span>
                    </div>
                    
                    {client.accountManager && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Account Manager</span>
                        </div>
                        <span>{client.accountManager}</span>
                      </div>
                    )}
                    
                    {client.taxId && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <ClipboardList className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {client.type === "business" ? "Tax ID" : "SSN"}
                          </span>
                        </div>
                        <span>{client.taxId}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {client.financialData && (
                  <div>
                    <h3 className="text-md font-medium mb-3">Financial Information</h3>
                    <div className="bg-muted/50 p-4 rounded-md space-y-3">
                      {client.financialData.yearlyRevenue && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Annual Revenue</span>
                          </div>
                          <span>
                            ${client.financialData.yearlyRevenue.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {client.financialData.taxRate && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Tax Rate</span>
                          </div>
                          <span>{client.financialData.taxRate}%</span>
                        </div>
                      )}
                      
                      {client.financialData.fiscalYearEnd && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Fiscal Year End</span>
                          </div>
                          <span>{client.financialData.fiscalYearEnd}</span>
                        </div>
                      )}
                      
                      {client.financialData.accountingMethod && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Accounting Method</span>
                          </div>
                          <span className="capitalize">
                            {client.financialData.accountingMethod}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {client.notes && (
                  <div>
                    <h3 className="text-md font-medium mb-2">Notes</h3>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm">{client.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow">
            <ClientWorkflow client={client} />
          </TabsContent>
          
          <TabsContent value="documents">
            <ClientDocuments client={client} />
          </TabsContent>
          
          <TabsContent value="tasks">
            <ClientTasks client={client} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component for status badges
const ClientStatusBadge = ({ status }: { status: Client['status'] }) => {
  if (status === 'active') {
    return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
  } else if (status === 'pending') {
    return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
  } else {
    return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
  }
};

export default ClientDetails;
