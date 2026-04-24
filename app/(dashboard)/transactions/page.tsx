"use client";

import { useState, useEffect } from "react";
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  User,
  Calendar,
  MapPin,
  MoreVertical,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  id: string;
  montant: number;
  type: "DEPOT" | "RETRAIT";
  statut: string;
  createdAt: string;
  client: { nom: string; prenom: string; numeroCarte: string };
  collectrice: { nom: string; prenom: string };
}

export default function TransactionsHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/history?type=${filterType}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      toast.error("Erreur lors du chargement de l'historique.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterType]);

  return (
    <div className="space-y-8 animate-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Historique des Transactions</h2>
          <p className="text-slate-500 font-medium">Consultez et auditez tous les flux financiers de l'organisation.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 px-6 py-4 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
          <Download className="w-5 h-5" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex-1 flex gap-4">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-600 focus:border-slate-900 transition-all"
          >
            <option value="">Tous les types</option>
            <option value="DEPOT">Dépôts uniquement</option>
            <option value="RETRAIT">Retraits uniquement</option>
          </select>
          <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Date & Heure</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Client</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Collectrice</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Type</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 animate-pulse font-bold">Chargement des transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">Aucune transaction enregistrée.</td>
                </tr>
              ) : transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center text-slate-900 font-bold">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {new Date(t.createdAt).toLocaleString('fr-FR', { 
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-black text-slate-900 uppercase tracking-tight">{t.client.prenom} {t.client.nom}</p>
                      <p className="text-[10px] text-slate-400 font-black">CARTE: {t.client.numeroCarte}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-slate-600 font-bold">
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      {t.collectrice.prenom} {t.collectrice.nom}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      t.type === "DEPOT" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {t.type === "DEPOT" ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1" />}
                      {t.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className={`text-lg font-black ${t.type === "DEPOT" ? "text-emerald-600" : "text-red-600"}`}>
                      {t.type === "DEPOT" ? "+" : "-"}{formatCurrency(t.montant)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
