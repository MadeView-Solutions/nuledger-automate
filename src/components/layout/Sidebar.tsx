
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, FileCheck, TrendingUp, Receipt, Users, BookText, RefreshCcw, Link as LinkIcon, Settings } from "lucide-react";

interface SidebarProps {
  links: Array<{
    href: string;
    label: string;
    icon: string;
  }>;
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="size-5 text-blue-500" />,
  FileText: <FileText className="size-5 text-indigo-500" />,
  FileCheck: <FileCheck className="size-5 text-green-500" />,
  TrendingUp: <TrendingUp className="size-5 text-purple-500" />,
  Receipt: <Receipt className="size-5 text-pink-500" />,
  Users: <Users className="size-5 text-yellow-500" />,
  BookText: <BookText className="size-5 text-teal-500" />,
  RefreshCcw: <RefreshCcw className="size-5 text-orange-500" />,
  Link: <LinkIcon className="size-5 text-cyan-500" />,
  Settings: <Settings className="size-5 text-gray-500" />,
};

const Sidebar = ({ links }: SidebarProps) => {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground shrink-0 border-r border-border hidden md:block">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-nuledger-500 to-nuledger-700 flex items-center justify-center text-white font-medium">
            Nu
          </span>
          <span className="font-semibold text-lg tracking-tight text-sidebar-foreground">NuLedger</span>
        </div>
      </div>
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            {iconMap[link.icon]}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
