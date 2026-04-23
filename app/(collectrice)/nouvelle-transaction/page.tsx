"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Search, 
  User, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  X,
  CreditCard,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function NouvelleTransactionPage() {
  const router = useRouter();
  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  
  const [step, setStep] = useState(1); // 1: Search, 2: Amount/Type, 3: Success
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("DEPOT");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Rechercher des clients
  useEffect(() => {
    const searchClients = async () => {
      if (searchQuery.length < 2) {
        setClients([]);
        return;
      }
      setSearching(true);
      try {
        const res = await fetch(`/api/clients?q=${searchQuery}`);
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(searchClients, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Veuillez entrer un montant valide.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          montant: Number(amount),
          type,
          clientId: selectedClient.id,
          latitude: location?.latitude,
          longitude: location?.longitude,
          note,
        }),
      });

      if (res.ok) {
        setStep(3);
        toast.success("Transaction enregistrée !");
      } else {
        toast.error("Échec de l'enregistrement.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Header */}
      <div className="p-6 flex items-center space-x-4">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">
          {step === 1 ? "Choisir un client" : step === 2 ? "Détails de la collecte" : "Succès"}
        </h1>
      </div>

      <div className="flex-1 px-6 pb-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: CLIENT SEARCH */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Nom, téléphone ou n° de carte..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all outline-none font-medium"
                />
                {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-slate-400" />}
              </div>

              <div className="space-y-3">
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="w-full p-4 flex items-center justify-between bg-white border border-slate-100 rounded-2xl hover:border-emerald-500 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{client.prenom} {client.nom}</p>
                          <p className="text-xs text-slate-500">{client.numeroCarte} • {client.telephone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400">Solde</p>
                        <p className="text-sm font-black text-emerald-600">{formatCurrency(Number(client.solde))}</p>
                      </div>
                    </button>
                  ))
                ) : searchQuery.length >= 2 && !searching ? (
                  <div className="text-center py-10">
                    <p className="text-slate-500 italic">Aucun client trouvé</p>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center opacity-30">
                    <CreditCard className="w-16 h-16 mb-4" />
                    <p className="text-sm font-medium">Saisissez un nom pour commencer</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: AMOUNT & TYPE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Selected Client Card */}
              <div className="p-4 bg-emerald-600 rounded-3xl text-white shadow-lg shadow-emerald-600/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{selectedClient.prenom} {selectedClient.nom}</p>
                    <p className="text-xs opacity-80">{selectedClient.numeroCarte}</p>
                  </div>
                </div>
              </div>

              {/* Type Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  onClick={() => setType("DEPOT")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === "DEPOT" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
                >
                  Dépôt
                </button>
                <button
                  onClick={() => setType("RETRAIT")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === "RETRAIT" ? "bg-white text-red-600 shadow-sm" : "text-slate-500"}`}
                >
                  Retrait
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Montant (FCFA)</span>
                  <div className="flex items-center justify-center mt-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="text-5xl font-black text-center w-full focus:outline-none bg-transparent placeholder-slate-200"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Note (Optionnel)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ex: Collecte du matin..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    rows={3}
                  />
                </div>
              </div>

              {/* Info Bar */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center text-slate-500 text-xs">
                  <MapPin className={`w-4 h-4 mr-1 ${location ? "text-emerald-500" : "animate-pulse"}`} />
                  {geoLoading ? "Capture GPS..." : location ? "Position capturée" : "GPS désactivé"}
                </div>
                <div className="flex items-center text-slate-500 text-xs font-bold uppercase">
                  <Wallet className="w-4 h-4 mr-1" />
                  Total: {formatCurrency(Number(amount) || 0)}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !amount}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-center"
              >
                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirmer la transaction"}
              </button>
            </motion.div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900">Succès !</h2>
                <p className="text-slate-500 mt-2">La transaction de {formatCurrency(Number(amount))} a été enregistrée.</p>
              </div>

              <div className="w-full p-6 border-2 border-dashed border-slate-200 rounded-[32px] space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Client</span>
                  <span className="text-slate-900 font-bold">{selectedClient.prenom} {selectedClient.nom}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Type</span>
                  <span className={`font-bold ${type === "DEPOT" ? "text-emerald-600" : "text-red-600"}`}>{type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Date</span>
                  <span className="text-slate-900 font-bold">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/accueil")}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]"
              >
                Retour à l'accueil
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
