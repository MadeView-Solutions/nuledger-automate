
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Invoicing from "@/pages/Invoicing";
import TaxCompliance from "@/pages/TaxCompliance";
import FinancialForecasting from "@/pages/FinancialForecasting";
import ReceiptProcessing from "@/pages/ReceiptProcessing";
import Payroll from "@/pages/Payroll";
import AIBookkeeping from "@/pages/AIBookkeeping";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import BankReconciliation from "@/pages/BankReconciliation";
import Clients from "@/pages/Clients";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoicing" element={<Invoicing />} />
        <Route path="/tax-compliance" element={<TaxCompliance />} />
        <Route path="/financial-forecasting" element={<FinancialForecasting />} />
        <Route path="/receipt-processing" element={<ReceiptProcessing />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/ai-bookkeeping" element={<AIBookkeeping />} />
        <Route path="/bank-reconciliation" element={<BankReconciliation />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<Clients />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
