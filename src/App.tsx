
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QuickBooksProvider } from "@/hooks/useQuickBooks";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";


import FinancialForecasting from "@/pages/FinancialForecasting";
import ReceiptProcessing from "@/pages/ReceiptProcessing";
import Payroll from "@/pages/Payroll";
import AIBookkeeping from "@/pages/AIBookkeeping";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import BankReconciliation from "@/pages/BankReconciliation";
import Clients from "@/pages/Clients";
import Reports from "@/pages/Reports";
import QuickBooksCallback from "@/components/integrations/QuickBooksCallback";
import DataMigration from "@/pages/DataMigration";
import TrustAccounting from "@/pages/TrustAccounting";
import SettlementDisbursement from "@/pages/SettlementDisbursement";

function App() {
  return (
    <QuickBooksProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          
          <Route path="/financial-forecasting" element={<FinancialForecasting />} />
          <Route path="/receipt-processing" element={<ReceiptProcessing />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/ai-bookkeeping" element={<AIBookkeeping />} />
          <Route path="/bank-reconciliation" element={<BankReconciliation />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<Clients />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/integrations/quickbooks/callback" element={<QuickBooksCallback />} />
          <Route path="/data-migration" element={<DataMigration />} />
          <Route path="/trust-accounting" element={<TrustAccounting />} />
          <Route path="/settlement-disbursement" element={<SettlementDisbursement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </QuickBooksProvider>
  );
}

export default App;
