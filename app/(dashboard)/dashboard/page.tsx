"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Receipt, 
  TrendingUp, 
  Activity, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import dynamic from "next/dynamic";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

// Import dynamique de la carte pour éviter les erreurs SSR de Leaflet
const CarteTempsReel = dynamic(
  () => import("@/components/carte/CarteTempsReel"),
  { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center font-bold text-slate-400">Chargement de la carte...</div> }
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCollecte: 0,
    clientsActifs: 0,
    transactionsJour: 0,
    collectricesEnLigne: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les stats réelles
    const fetchDashboardData = async () => {
      try {
        const [statsRes, transRes] = await Promise.all([
          fetch("/api/stats/performance"), // On va réutiliser cette API pour les compteurs
          fetch("/api/transactions/history?limit=5")
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          // On simplifie pour l'exemple, à affiner selon la structure exacte de performance
          setStats({
            totalCollecte: data.reduce((acc: number, curr: any) => acc + Number(curr.montantTotal), 0),
            clientsActifs: 42, // À remplacer par un vrai count client plus tard
            transactionsJour: data.reduce((acc: number, curr: any) => acc + curr.nombreTransactions, 0),
            collectricesEnLigne: data.length
          });
        }

        if (transRes.ok) {
          const transData = await transRes.json();
          setRecentTransactions(transData.slice(0, 5));
        }
      } catch (err) {
        console.error("Erreur Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Collecte Totale", value: formatCurrency(stats.totalCollecte), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Clients Actifs", value: stats.clientsActifs.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Transactions (Jour)", value: stats.transactionsJour.toString(), icon: Receipt, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Collectrices Live", value: stats.collectricesEnLigne.toString(), icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vue d'ensemble</h2>
          <p className="text-slate-500 font-medium">Voici l'activité de votre organisation aujourd'hui.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title}
            className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:border-slate-900 transition-all"
          >
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.title}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CARTE TEMPS RÉEL */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
              Positions en direct
            </h3>
          </div>
          <div className="h-[500px] rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-slate-100">
            <CarteTempsReel />
          </div>
        </div>

        {/* DERNIÈRES TRANSACTIONS */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-blue-600" />
            Flux récents
          </h3>
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-4 h-[500px] overflow-y-auto space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
              </div>
            ) : recentTransactions.length === 0 ? (
              <p className="text-center py-20 text-slate-400 font-bold">Aucune activité récente.</p>
            ) : recentTransactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === "DEPOT" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                    {t.type === "DEPOT" ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-xs uppercase">{t.client.prenom} {t.client.nom}</p>
                    <p className="text-[9px] font-bold text-slate-400">{new Date(t.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <p className={`font-black text-sm ${t.type === "DEPOT" ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(t.montant)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
