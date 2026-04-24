"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Loader2,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface Alerte {
  id: string;
  type: string;
  niveau: "INFO" | "AVERTISSEMENT" | "CRITIQUE";
  message: string;
  createdAt: string;
  collectrice: { nom: string; prenom: string };
  transaction?: { montant: number };
}

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlertes = async () => {
    try {
      const res = await fetch("/api/alertes");
      if (res.ok) {
        const data = await res.json();
        setAlertes(data);
      }
    } catch (err) {
      toast.error("Erreur lors du chargement des alertes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertes();
  }, []);

  const getNiveauStyles = (niveau: string) => {
    switch (niveau) {
      case "CRITIQUE": return "bg-red-600 text-white";
      case "AVERTISSEMENT": return "bg-amber-500 text-white";
      default: return "bg-slate-900 text-white";
    }
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Centre de Sécurité</h2>
          <p className="text-slate-500 font-medium">Surveillez les anomalies et les incidents en temps réel.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="font-black text-slate-900">{alertes.length}</span>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alertes</span>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-slate-300" />
            <p className="mt-4 text-slate-400 font-bold uppercase text-xs">Analyse du flux...</p>
          </div>
        ) : alertes.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Tout est sous contrôle</h3>
            <p className="text-slate-400 font-medium">Aucune anomalie détectée pour le moment.</p>
          </div>
        ) : (
          alertes.map((alerte) => (
            <div key={alerte.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className={`md:w-32 flex flex-col items-center justify-center p-6 ${getNiveauStyles(alerte.niveau)}`}>
                <AlertTriangle className="w-8 h-8 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">{alerte.niveau}</span>
              </div>
              <div className="flex-1 p-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{alerte.type.replace(/_/g, ' ')}</h3>
                    <p className="text-slate-500 font-medium mt-1">{alerte.message}</p>
                  </div>
                  <div className="flex items-center text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full uppercase tracking-widest">
                    <Clock className="w-3 h-3 mr-2" />
                    {new Date(alerte.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex flex-wrap gap-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Collectrice</p>
                      <p className="font-bold text-slate-900">{alerte.collectrice.prenom} {alerte.collectrice.nom}</p>
                    </div>
                  </div>

                  {alerte.transaction && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Montant</p>
                        <p className="font-bold text-slate-900">{formatCurrency(alerte.transaction.montant)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Localisation</p>
                      <p className="font-bold text-slate-900">En cours d'analyse</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all">
                    Marquer comme résolu
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
