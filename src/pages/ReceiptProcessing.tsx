
import React from "react";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReceiptProcessorTabs from "@/components/receipt-processor/ReceiptProcessorTabs";
import ReceiptProcessorHeader from "@/components/receipt-processor/ReceiptProcessorHeader";
import ReceiptProcessingStats from "@/components/receipt-processor/ReceiptProcessingStats";

const ReceiptProcessing = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <Container className="max-w-full">
          <ReceiptProcessorHeader />
          <div className="space-y-8">
            <ReceiptProcessingStats />
            <ReceiptProcessorTabs />
          </div>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default ReceiptProcessing;
