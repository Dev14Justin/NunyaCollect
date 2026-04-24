"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Building2, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export default function ParametresPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orgData, setOrgData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: ""
  });

  useEffect(() => {
    fetch("/api/parametres")
      .then(res => res.json())
      .then(data => {
        setOrgData({
          nom: data.nom || "",
          email: data.email || "",
          telephone: data.telephone || "",
          adresse: data.adresse || ""
        });
        setLoading(false);
      });
  }, []);

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/parametres", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgData)
      });
      if (res.ok) {
        toast.success("Informations de l'organisation mises à jour.");
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
      <p className="mt-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Initialisation...</p>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8 animate-in">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configuration</h2>
        <p className="text-slate-500 font-medium">Gérez les informations de votre entreprise et votre sécurité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* SIDEBAR PARAMETRES */}
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-900 text-white rounded-2xl font-bold transition-all">
            <Building2 className="w-5 h-5" />
            <span>Organisation</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-2xl font-bold transition-all">
            <User className="w-5 h-5" />
            <span>Mon Profil</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-2xl font-bold transition-all">
            <Lock className="w-5 h-5" />
            <span>Sécurité</span>
          </button>
        </div>

        {/* MAIN FORM */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Détails de l'Entreprise</h3>
            </div>

            <form onSubmit={handleUpdateOrg} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom de l'Organisation</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    value={orgData.nom}
                    onChange={(e) => setOrgData({...orgData, nom: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email de contact</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="email" 
                      value={orgData.email}
                      onChange={(e) => setOrgData({...orgData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="tel" 
                      value={orgData.telephone}
                      onChange={(e) => setOrgData({...orgData, telephone: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Siège Social</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    value={orgData.adresse}
                    onChange={(e) => setOrgData({...orgData, adresse: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-[24px] hover:bg-emerald-600 transition-all flex items-center justify-center active:scale-95 disabled:bg-slate-200"
              >
                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Enregistrer les modifications</>}
              </button>
            </form>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-start space-x-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-black text-emerald-900 uppercase text-xs tracking-widest">Sécurité du compte</p>
              <p className="text-emerald-700 text-sm font-medium mt-1 leading-relaxed">
                Votre organisation est actuellement protégée par un chiffrement AES-256. Toutes les modifications de paramètres sont journalisées pour l'audit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
