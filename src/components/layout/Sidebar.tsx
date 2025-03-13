
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
  Home: <Home className="size-5" />,
  FileText: <FileText className="size-5" />,
  FileCheck: <FileCheck className="size-5" />,
  TrendingUp: <TrendingUp className="size-5" />,
  Receipt: <Receipt className="size-5" />,
  Users: <Users className="size-5" />,
  BookText: <BookText className="size-5" />,
  RefreshCcw: <RefreshCcw className="size-5" />,
  Link: <LinkIcon className="size-5" />,
  Settings: <Settings className="size-5" />,
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
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
