"use client";

import { Bell, Search, User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher une transaction, collectrice..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Admin Nunya</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-transparent group-hover:border-emerald-500 transition-all">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
