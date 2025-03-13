
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
  Home: <Home className="size-5 text-sidebar-foreground" />,
  FileText: <FileText className="size-5 text-sidebar-foreground" />,
  FileCheck: <FileCheck className="size-5 text-sidebar-foreground" />,
  TrendingUp: <TrendingUp className="size-5 text-sidebar-foreground" />,
  Receipt: <Receipt className="size-5 text-sidebar-foreground" />,
  Users: <Users className="size-5 text-sidebar-foreground" />,
  BookText: <BookText className="size-5 text-sidebar-foreground" />,
  RefreshCcw: <RefreshCcw className="size-5 text-sidebar-foreground" />,
  Link: <LinkIcon className="size-5 text-sidebar-foreground" />,
  Settings: <Settings className="size-5 text-sidebar-foreground" />,
};

const Sidebar = ({ links }: SidebarProps) => {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground shrink-0 border-r border-border hidden md:block">
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
            <span className="text-sidebar-foreground">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
