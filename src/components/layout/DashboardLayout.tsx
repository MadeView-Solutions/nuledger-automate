
import React from "react";
import Sidebar from "@/components/layout/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          links={[
            { href: "/dashboard", label: "Dashboard", icon: "Home" },
            { href: "/clients", label: "Clients", icon: "Briefcase" },
            { href: "/invoicing", label: "Invoicing", icon: "FileText" },
            { href: "/tax-compliance", label: "Tax Compliance", icon: "FileCheck" },
            { href: "/financial-forecasting", label: "Financial Forecasting", icon: "TrendingUp" },
            { href: "/receipt-processing", label: "Receipt Processing", icon: "Receipt" },
            { href: "/payroll", label: "Payroll", icon: "Users" },
            { href: "/ai-bookkeeping", label: "AI Bookkeeping", icon: "BookText" },
            { href: "/bank-reconciliation", label: "Bank Reconciliation", icon: "RefreshCcw" },
            { href: "/integrations", label: "Integrations", icon: "Link" },
            { href: "/settings", label: "Settings", icon: "Settings" },
          ]}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
