import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchIcon, BellIcon, Menu, Settings, LogOut, User, HelpCircle, Home, BarChart3, FileText, CreditCard, Users, PieChart, ShieldCheck, Calculator } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: BarChart3 },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Tax Compliance", href: "/tax-compliance", icon: Calculator },
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-nuledger-500 to-nuledger-700 flex items-center justify-center text-white font-medium">
                Nu
              </span>
              <span className="font-semibold text-lg tracking-tight">NuLedger</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-5 px-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isCurrentRoute = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition ease-in-out",
                      isCurrentRoute
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn("mr-3 h-5 w-5 flex-shrink-0", isCurrentRoute ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
              <div className="ml-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
        <header className="z-10 h-16 flex items-center bg-card border-b border-border px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center justify-between">
            <div className="lg:hidden">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:space-x-4">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings className="h-5 w-5" />
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
