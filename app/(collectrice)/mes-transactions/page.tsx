"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Calendar,
  Loader2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  id: string;
  montant: number;
  type: "DEPOT" | "RETRAIT";
  createdAt: string;
  client: { nom: string; prenom: string };
}

export default function MesTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collectrice/transactions")
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER MOBILE */}
      <div className="bg-slate-900 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/accueil" className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight">Mon Historique</h1>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase opacity-60">Total Collecté (24h)</p>
            <p className="text-2xl font-black text-emerald-400">
              {formatCurrency(transactions.reduce((acc, t) => t.type === "DEPOT" ? acc + Number(t.montant) : acc, 0))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase opacity-60">Opérations</p>
            <p className="text-2xl font-black">{transactions.length}</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-slate-300" />
            <p className="mt-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Chargement...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
            <History className="w-12 h-12 mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase text-xs">Aucune transaction</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  t.type === "DEPOT" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {t.type === "DEPOT" ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                    {t.client.prenom} {t.client.nom}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(t.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-black ${
                  t.type === "DEPOT" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {t.type === "DEPOT" ? "+" : "-"}{formatCurrency(t.montant)}
                </p>
                <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{t.type}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* BOTTOM NAV PLACEHOLDER FOR SPACING */}
      <div className="h-10" />
    </div>
  );
}
