import { 
  Plus, 
  History, 
  LayoutGrid, 
  MapPin, 
  TrendingUp,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function CollectriceAccueil() {
  const goal = 500000;
  const current = 185000;
  const progress = (current / goal) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Mobile */}
      <div className="p-6 bg-emerald-600 text-white rounded-b-[40px] shadow-lg shadow-emerald-600/20">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">Salut, Jessica 👋</h1>
            <p className="text-emerald-100 text-sm">Marché d'Assigamé — Zone A</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <LayoutGrid className="w-6 h-6" />
          </div>
        </div>

        {/* Objectif du jour */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-emerald-100 text-xs font-medium mb-1">Collecté aujourd'hui</p>
              <p className="text-3xl font-black">{formatCurrency(current)}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-xs font-medium mb-1">Objectif</p>
              <p className="text-sm font-bold opacity-80">{formatCurrency(goal)}</p>
            </div>
          </div>
          
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-6 -mt-8 flex-1 pb-24">
        <Link 
          href="/nouvelle-transaction"
          className="flex items-center justify-between p-6 bg-white rounded-[32px] border border-slate-200 card-shadow group hover:border-emerald-500 transition-all active:scale-95"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Nouvelle Collecte</h3>
              <p className="text-slate-500 text-sm">Enregistrer un dépôt client</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">32</p>
            <p className="text-xs text-slate-500 font-medium">Transactions</p>
          </div>
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">4.2km</p>
            <p className="text-xs text-slate-500 font-medium">Parcourus</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-slate-900">Dernières collectes</h3>
            <Link href="/mes-transactions" className="text-emerald-600 text-xs font-bold hover:underline">Voir tout</Link>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Mme. Diallo</p>
                    <p className="text-[10px] text-slate-400">#99201 • 14:32</p>
                  </div>
                </div>
                <p className="font-black text-emerald-600">+{formatCurrency(2500)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Mobile Bas (Simulée) */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 px-10 flex items-center justify-between rounded-t-[30px] shadow-2xl">
        <button className="text-emerald-600"><LayoutGrid className="w-6 h-6" /></button>
        <button className="text-slate-300 hover:text-emerald-500 transition-colors"><History className="w-6 h-6" /></button>
        <button className="text-slate-300 hover:text-emerald-500 transition-colors"><MapPin className="w-6 h-6" /></button>
        <div className="w-10 h-10 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
