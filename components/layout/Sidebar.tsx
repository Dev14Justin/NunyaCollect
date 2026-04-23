"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Map as MapIcon, 
  FileText, 
  AlertTriangle, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
  { name: "Collectrices", href: "/collectrices", icon: Users },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Carte Live", href: "/carte", icon: MapIcon },
  { name: "Rapports", href: "/rapports", icon: FileText },
  { name: "Alertes", href: "/alertes", icon: AlertTriangle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "flex flex-col h-full bg-secondary text-secondary-foreground transition-all duration-300 ease-in-out border-r border-border/10",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-20 px-6 border-b border-border/10">
        {!collapsed && (
          <span className="text-xl font-bold tracking-tight text-white">
            Nunya<span className="text-emerald-500">Collect</span>
          </span>
        )}
        {collapsed && (
          <span className="text-xl font-bold text-emerald-500 mx-auto">N</span>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0",
                isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400",
                !collapsed && "mr-3"
              )} />
              {!collapsed && <span>{item.name}</span>}
              {collapsed && (
                <div className="absolute left-full ml-6 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/10">
        <Link
          href="/parametres"
          className={cn(
            "flex items-center px-3 py-3 text-sm font-medium rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group",
            pathname === "/parametres" && "bg-slate-800 text-white"
          )}
        >
          <Settings className={cn(
            "w-5 h-5 shrink-0",
            !collapsed && "mr-3"
          )} />
          {!collapsed && <span>Paramètres</span>}
        </Link>
        
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          )}
        >
          <LogOut className={cn(
            "w-5 h-5 shrink-0",
            !collapsed && "mr-3"
          )} />
          {!collapsed && <span>Déconnexion</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-4 flex items-center justify-center w-full py-2 text-slate-500 hover:text-emerald-400 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
