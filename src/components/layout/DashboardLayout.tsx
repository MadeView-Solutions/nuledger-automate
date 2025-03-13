
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchIcon, BellIcon, Menu, Settings, LogOut, User, HelpCircle, Home, BarChart3, FileText, CreditCard, Users, PieChart, ShieldCheck, Calculator, TrendingUp } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Custom colors for each icon to make them more visually distinct
const iconColors = {
  "Dashboard": "#9b87f5", // Primary Purple
  "Transactions": "#F97316", // Bright Orange
  "Invoices": "#D946EF", // Magenta Pink
  "Payments": "#0EA5E9", // Ocean Blue
  "Clients": "#8B5CF6", // Vivid Purple
  "Reports": "#F97316", // Bright Orange
  "Tax Compliance": "#D946EF", // Magenta Pink
  "Financial Forecasting": "#10B981", // Emerald Green
  "API Keys": "#0EA5E9", // Ocean Blue
};

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: BarChart3 },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Tax Compliance", href: "/tax-compliance", icon: Calculator },
  { name: "Financial Forecasting", href: "/financial-forecasting", icon: TrendingUp },
  { name: "API Keys", href: "/settings", icon: ShieldCheck },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-200",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border bg-gradient-to-r from-sidebar-accent to-sidebar-background">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
                Nu
              </span>
              <span className="font-semibold text-lg tracking-tight text-white">NuLedger</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-5 px-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isCurrentRoute = location.pathname === item.href;
                const iconColor = iconColors[item.name as keyof typeof iconColors] || "#9b87f5";
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition ease-in-out",
                      isCurrentRoute
                        ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/70 text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className={cn(
                      "mr-3 flex-shrink-0",
                      isCurrentRoute 
                        ? "drop-shadow-glow" 
                        : ""
                    )}>
                      <item.icon
                        className="h-5 w-5"
                        color={isCurrentRoute ? "white" : iconColor}
                        strokeWidth={isCurrentRoute ? 2.5 : 2}
                      />
                    </div>
                    <span className={isCurrentRoute ? "font-semibold" : ""}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/50">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-background">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-white/80">john@example.com</p>
              </div>
              <div className="ml-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-sidebar-accent hover:text-white">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="z-10 h-16 flex items-center bg-header text-white shadow-md">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2 ml-4 text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center justify-between px-4">
            <div className="lg:hidden">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:space-x-4">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative text-white hover:bg-white/10">
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-header"></span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10 relative">
                  <Settings className="h-5 w-5" />
                  {location.pathname === "/settings" && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
