import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { BookText, FileCheck, FileText, Home, Link, Receipt, RefreshCcw, Settings, TrendingUp, Users } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          links={[
            { href: "/dashboard", label: "Dashboard", icon: "Home" },
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
      <Footer />
    </div>
  );
};

export default DashboardLayout;
