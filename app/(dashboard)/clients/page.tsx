"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  Phone, 
  CreditCard, 
  MapPin, 
  Wallet,
  History,
  MoreVertical,
  UserPlus,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  numeroCarte: string;
  adresse?: string;
  solde: number;
  dateInscription: string;
  _count: { transactions: number };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    numeroCarte: "",
    adresse: ""
  });

  const fetchClients = async () => {
    try {
      const res = await fetch(`/api/clients?q=${searchTerm}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      toast.error("Erreur de chargement des clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Client ajouté avec succès !");
        setIsModalOpen(false);
        setFormData({ nom: "", prenom: "", telephone: "", numeroCarte: "", adresse: "" });
        fetchClients();
      } else {
        const err = await res.text();
        toast.error(err);
      }
    } catch (err) {
      toast.error("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Clients</h2>
          <p className="text-slate-500 font-medium">Suivez vos épargnants et leurs soldes en temps réel.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, téléphone ou n° de carte..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900"
          />
        </div>
      </div>

      {/* CLIENTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading && clients.length === 0 ? (
             <div className="col-span-full py-20 text-center text-slate-400 font-bold">
               <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
               Chargement de la base clients...
             </div>
          ) : clients.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold">
              Aucun client trouvé pour cette recherche.
            </div>
          ) : clients.map((client) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={client.id}
              className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:border-slate-900 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center font-black text-xl">
                  {client.prenom[0]}{client.nom[0]}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Solde actuel</span>
                  <p className="text-xl font-black text-emerald-600">{formatCurrency(client.solde)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{client.prenom} {client.nom}</h3>
                  <div className="flex items-center text-slate-500 text-xs mt-1 font-bold">
                    <CreditCard className="w-3 h-3 mr-1" />
                    CARTE : {client.numeroCarte}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <div className="flex items-center text-sm font-bold text-slate-600">
                    <Phone className="w-4 h-4 mr-2 text-slate-400" />
                    {client.telephone}
                  </div>
                  {client.adresse && (
                    <div className="flex items-center text-sm font-bold text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {client.adresse}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collectes</p>
                      <p className="font-black text-slate-900">{client._count.transactions}</p>
                    </div>
                  </div>
                  <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-900/10">
                    <History className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ADD CLIENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 md:p-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">Nouveau Client</h3>
              <p className="text-slate-500 font-medium mb-8">Enregistrez un nouvel épargnant dans le système.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Prénom</label>
                    <input 
                      type="text" 
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Téléphone</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Numéro de Carte Client</label>
                  <input 
                    type="text" 
                    required
                    value={formData.numeroCarte}
                    onChange={(e) => setFormData({...formData, numeroCarte: e.target.value})}
                    placeholder="NC-XXXXXX"
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adresse (Optionnel)</label>
                  <input 
                    type="text" 
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-slate-900 text-white font-black text-xl rounded-[24px] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center active:scale-95 disabled:bg-slate-200"
                >
                  {loading ? "Création..." : "Enregistrer le client"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
