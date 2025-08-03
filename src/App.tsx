
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QuickBooksProvider } from "@/hooks/useQuickBooks";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";


import FinancialForecasting from "@/pages/FinancialForecasting";
import ReceiptProcessing from "@/pages/ReceiptProcessing";

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
import SettlementManagement from "@/pages/SettlementManagement";
import CheckLedger from "@/pages/CheckLedger";
import LegalAnalytics from "@/pages/LegalAnalytics";
import FilevineIntegration from "@/pages/FilevineIntegration";
import ExpenseManagement from "@/pages/ExpenseManagement";
import TestCases from "@/pages/TestCases";

function App() {
  return (
    <QuickBooksProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          
          <Route path="/financial-forecasting" element={<FinancialForecasting />} />
          <Route path="/receipt-processing" element={<ReceiptProcessing />} />
          
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
          <Route path="/settlement-management" element={<SettlementManagement />} />
          <Route path="/check-ledger" element={<CheckLedger />} />
          <Route path="/legal-analytics" element={<LegalAnalytics />} />
          <Route path="/filevine-integration" element={<FilevineIntegration />} />
          <Route path="/expense-management" element={<ExpenseManagement />} />
          <Route path="/test-cases" element={<TestCases />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </QuickBooksProvider>
  );
}

export default App;
