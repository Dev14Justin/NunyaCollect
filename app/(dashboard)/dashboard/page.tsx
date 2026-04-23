"use client";

import dynamic from "next/dynamic";
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  User
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CollectionsChart, PerformanceChart } from "@/components/dashboard/DashboardCharts";

const CarteTempsReel = dynamic(() => import("@/components/carte/CarteTempsReel"), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-slate-800 w-full h-full rounded-3xl" />
});

const stats = [
  { 
    name: "Collecté aujourd'hui", 
    value: 1250000, 
    change: "+12.5%", 
    trend: "up", 
    icon: Wallet,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  { 
    name: "Collectrices actives", 
    value: 24, 
    change: "+2", 
    trend: "up", 
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    name: "Transactions", 
    value: 142, 
    change: "+18%", 
    trend: "up", 
    icon: TrendingUp,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  { 
    name: "Alertes critiques", 
    value: 3, 
    change: "-1", 
    trend: "down", 
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tableau de bord</h2>
        <p className="text-slate-500">Bienvenue sur NunyaCollect. Voici un aperçu de l'activité en temps réel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-white rounded-2xl border border-slate-200 card-shadow transition-all hover:border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-2 rounded-xl " + stat.color}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-amber-600"}`}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="ml-1 w-3 h-3" /> : <ArrowDownRight className="ml-1 w-3 h-3" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">
                {typeof stat.value === "number" && stat.name.includes("Collecté") ? formatCurrency(stat.value) : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LA CARTE TEMPS RÉEL */}
        <div className="h-[400px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <CarteTempsReel />
        </div>

        {/* ÉVOLUTION DE LA COLLECTE */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Évolution de la Collecte</h3>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">Aujourd'hui</span>
          </div>
          <CollectionsChart />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PERFORMANCE DES COLLECTRICES */}
        <div className="lg:col-span-1 p-6 bg-white rounded-3xl border border-slate-200 card-shadow">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top Collectrices</h3>
          <PerformanceChart />
        </div>

        {/* Dernières Transactions */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-200 card-shadow">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Dernières Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Client #{1000 + i}</p>
                    <p className="text-xs text-slate-500">Collectrice: Ami Koumé</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+{formatCurrency(5000 * i)}</p>
                  <p className="text-xs text-slate-400">Il y a {i * 5} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
