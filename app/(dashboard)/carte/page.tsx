"use client";

import dynamic from "next/dynamic";
import { Users, Filter, Navigation, Layers } from "lucide-react";

// Import dynamique de la carte pour éviter les erreurs SSR de Leaflet
const CarteTempsReel = dynamic(() => import("@/components/carte/CarteTempsReel"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="animate-pulse">Initialisation des modules cartographiques...</p>
      </div>
    </div>
  )
});

export default function CartePage() {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Suivi en Direct</h2>
          <p className="text-slate-500 text-sm">Visualisez la position de vos équipes sur le terrain en temps réel.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
          <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
            <Layers className="w-4 h-4 mr-2" />
            Zones
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Barre flottante d'infos rapide */}
        <div className="absolute top-6 left-6 z-[1000] flex flex-col space-y-2 pointer-events-none">
          <div className="px-4 py-3 bg-white/90 backdrop-blur shadow-xl border border-slate-200 rounded-2xl pointer-events-auto">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <p className="text-xs font-bold text-slate-900">24 Collectrices en ligne</p>
            </div>
          </div>
        </div>

        {/* Contrôles de carte flottants */}
        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col space-y-2">
          <button className="p-3 bg-white shadow-xl border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
            <Navigation className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white shadow-xl border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
            <Users className="w-5 h-5" />
          </button>
        </div>

        {/* LA CARTE */}
        <div className="w-full h-full">
          <CarteTempsReel />
        </div>
      </div>
    </div>
  );
}
