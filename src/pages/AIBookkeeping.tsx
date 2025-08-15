
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TransactionManager from "@/components/bookkeeping/TransactionManager";
import JournalEntries from "@/components/bookkeeping/JournalEntries";
import AccountSync from "@/components/bookkeeping/AccountSync";

const AIBookkeeping = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">AI-Powered Bookkeeping</h1>
          <div className="flex space-x-3">
            <Button variant="outline">Export Data</Button>
            <Button>Sync Accounts</Button>
          </div>
        </div>


        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="journal">Journal Entries</TabsTrigger>
            <TabsTrigger value="accounts">Account Sync</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <TransactionManager />
          </TabsContent>
          
          <TabsContent value="journal">
            <JournalEntries />
          </TabsContent>
          
          <TabsContent value="accounts">
            <AccountSync />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default AIBookkeeping;
