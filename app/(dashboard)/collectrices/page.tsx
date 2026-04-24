"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Trash2,
  Mail,
  User,
  Plus,
  X
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Collectrice {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  statut: "ACTIVE" | "INACTIVE" | "SUSPENDU";
  createdAt: string;
  _count: { transactions: number };
}

export default function CollectricesPage() {
  const [collectrices, setCollectrices] = useState<Collectrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: ""
  });

  const fetchCollectrices = async () => {
    try {
      const res = await fetch("/api/collectrices");
      if (res.ok) {
        const data = await res.json();
        setCollectrices(data);
      }
    } catch (err) {
      toast.error("Impossible de charger les collectrices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectrices();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/collectrices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Collectrice ajoutée avec succès !");
        setIsAddModalOpen(false);
        setFormData({ nom: "", prenom: "", email: "", password: "" });
        fetchCollectrices();
      } else {
        toast.error("Erreur lors de l'ajout.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = collectrices.filter(c => 
    `${c.prenom} ${c.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Collectrices</h2>
          <p className="text-slate-500 font-medium">Pilotez votre équipe de terrain et gérez les accès.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Collectrice</span>
        </button>
      </div>

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 transition-all outline-none font-medium text-slate-900"
          />
        </div>
        <select className="px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-600">
          <option>Tous les statuts</option>
          <option>Actif</option>
          <option>Suspendu</option>
        </select>
      </div>

      {/* LISTE DES COLLECTRICES */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Utilisatrice</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Transactions</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Inscription</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 animate-pulse font-bold">Chargement des données...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">Aucune collectrice trouvée.</td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                        {c.prenom[0]}{c.nom[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{c.prenom} {c.nom}</p>
                        <p className="text-xs text-slate-500 font-medium">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      c.statut === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {c.statut === "ACTIVE" ? (
                        <><ShieldCheck className="w-3 h-3 mr-1" /> Actif</>
                      ) : (
                        <><ShieldAlert className="w-3 h-3 mr-1" /> Suspendu</>
                      )}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-900">{c._count.transactions}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase">Collectes</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-slate-500 text-sm font-medium">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-slate-900">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL D'AJOUT */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <UserPlus className="w-6 h-6" />
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">Ajouter une collectrice</h3>
              <p className="text-slate-500 font-medium mb-8">Créez un nouveau compte pour une collaboratrice.</p>

              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Prénom</label>
                    <input 
                      type="text" 
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email professionnel</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe provisoire</label>
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-emerald-600 text-white font-black text-xl rounded-3xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center active:scale-95 disabled:bg-slate-200"
                >
                  {loading ? "Création..." : "Enregistrer la collectrice"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
