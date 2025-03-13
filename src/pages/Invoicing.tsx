
import React from "react";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import InvoiceManager from "@/components/invoicing/InvoiceManager";
import InvoiceStats from "@/components/invoicing/InvoiceStats";
import PaymentProcessing from "@/components/invoicing/PaymentProcessing";

const Invoicing = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <Container className="max-w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Smart Invoicing & Payment Processing</h1>
          </div>

          <div className="space-y-8">
            <InvoiceStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InvoiceManager />
              </div>
              <div>
                <PaymentProcessing />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default Invoicing;
