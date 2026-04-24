"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Search, 
  User, 
  CreditCard, 
  Banknote, 
  FileText,
  CheckCircle2,
  Loader2,
  X
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Client {
  id: string;
  nom: string;
  prenom: string;
  numeroCarte: string;
}

export default function NouvelleTransaction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Recherche client
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Formulaire
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"DEPOT" | "RETRAIT">("DEPOT");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(`/api/clients?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => setSearchResults(data));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSubmit = async () => {
    if (!selectedClient || !amount) return;
    setLoading(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient.id,
          montant: parseFloat(amount),
          type,
          note
        })
      });

      if (res.ok) {
        setStep(3); // Écran de succès
      } else {
        toast.error("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* HEADER */}
      <div className="bg-slate-900 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center space-x-4">
          <Link href="/accueil" className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight">Nouvelle Collecte</h1>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">Rechercher l'Épargnant</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Nom ou Numéro de carte..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                />
              </div>

              {/* Résultats de recherche */}
              <div className="mt-4 space-y-2">
                {searchResults.map(client => (
                  <button 
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setStep(2);
                    }}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-900 border border-slate-100">
                        {client.prenom[0]}{client.nom[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase">{client.prenom} {client.nom}</p>
                        <p className="text-[10px] font-bold text-slate-400">CARTE: {client.numeroCarte}</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-slate-300 rotate-180 group-hover:text-emerald-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && selectedClient && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Infos Client Récap */}
            <div className="bg-slate-900 text-white p-6 rounded-[32px] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Client sélectionné</p>
                <p className="text-lg font-black uppercase tracking-tight">{selectedClient.prenom} {selectedClient.nom}</p>
              </div>
              <button onClick={() => setStep(1)} className="p-2 bg-white/10 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulaire Montant */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button 
                  onClick={() => setType("DEPOT")}
                  className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${type === "DEPOT" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
                >
                  Dépôt
                </button>
                <button 
                  onClick={() => setType("RETRAIT")}
                  className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${type === "RETRAIT" ? "bg-red-600 text-white" : "text-slate-400"}`}
                >
                  Retrait
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Montant (FCFA)</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-14 pr-4 py-6 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-slate-900 outline-none transition-all font-black text-2xl text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Note / Observation</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900 min-h-[100px]"
                  placeholder="Optionnel..."
                />
              </div>

              <button 
                onClick={handleSubmit}
                disabled={loading || !amount}
                className="w-full py-6 bg-slate-900 text-white font-black text-xl rounded-3xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center active:scale-95 disabled:bg-slate-200"
              >
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : "Confirmer l'opération"}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-8">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/10">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Opération Réussie !</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Le client a été notifié.</p>
            </div>
            <Link 
              href="/accueil" 
              className="inline-flex items-center px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all"
            >
              Retour à l'accueil
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
