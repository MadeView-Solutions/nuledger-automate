
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AIBookkeeping from "./pages/AIBookkeeping";
import Invoicing from "./pages/Invoicing";
import ReceiptProcessing from "./pages/ReceiptProcessing";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TaxCompliance from "./pages/TaxCompliance";
import FinancialForecasting from "./pages/FinancialForecasting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookkeeping" element={<AIBookkeeping />} />
        <Route path="/invoicing" element={<Invoicing />} />
        <Route path="/receipt-processing" element={<ReceiptProcessing />} />
        <Route path="/tax-compliance" element={<TaxCompliance />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/financial-forecasting" element={<FinancialForecasting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
