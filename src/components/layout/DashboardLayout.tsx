
import React from "react";
import Sidebar from "@/components/layout/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          links={[
            { href: "/dashboard", label: "Dashboard", icon: "Home" },
            { href: "/clients", label: "Client Cases", icon: "Briefcase" },
            
            { href: "/settlement-disbursement", label: "Settlement Disbursement Templates", icon: "FileCheck" },
            { href: "/trust-accounting", label: "Trust Accounting", icon: "TrendingUp" },
            { href: "/check-ledger", label: "Check Ledger", icon: "Receipt" },
            { href: "/legal-analytics", label: "Legal Analytics", icon: "BarChart3" },
            { href: "/filevine-integration", label: "Filevine Integration", icon: "Link" },
            { href: "/reports", label: "Reports", icon: "BarChart" },
            
            { href: "/ai-bookkeeping", label: "AI Bookkeeping", icon: "BookText" },
            { href: "/bank-reconciliation", label: "Bank Reconciliation", icon: "RefreshCcw" },
            { href: "/data-migration", label: "Data Migration", icon: "Database" },
            { href: "/integrations", label: "Integrations", icon: "Link" },
            { href: "/settings", label: "Settings", icon: "Settings" },
          ]}
        />
        <main className="flex-1 overflow-auto md:ml-64">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
