import Link from "next/link";
import { ArrowRight, Shield, MapPin, BarChart3, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="container relative px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium text-emerald-400 border border-emerald-500/30 rounded-full bg-emerald-500/10 animate-in">
              <Shield className="w-4 h-4 mr-2" />
              Plateforme Sécurisée
            </div>
            <h1 className="mb-8 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Nunya<span className="text-emerald-500">Collect</span>
            </h1>
            <p className="mb-10 text-xl text-slate-400 leading-relaxed">
              Digitalisez, tracez et sécurisez la collecte d'épargne sur les marchés en temps réel. La solution complète pour les sociétés de micro-finance.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link
                href="/dashboard"
                className="w-full px-8 py-4 text-lg font-semibold text-white transition-all bg-emerald-600 rounded-xl hover:bg-emerald-500 hover:scale-105 active:scale-95 sm:w-auto flex items-center justify-center shadow-lg shadow-emerald-600/20"
              >
                Accéder au Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/accueil"
                className="w-full px-8 py-4 text-lg font-semibold text-white transition-all border border-slate-700 rounded-xl hover:bg-slate-900 hover:border-slate-600 sm:w-auto flex items-center justify-center"
              >
                Interface Collectrice
                <Smartphone className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container px-6 mx-auto">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="p-8 bg-white rounded-2xl border border-slate-200 card-shadow hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Géolocalisation Live</h3>
              <p className="text-slate-600">
                Suivez vos collectrices en temps réel sur une carte interactive et vérifiez leurs itinéraires quotidiens.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl border border-slate-200 card-shadow hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Transactions Sécurisées</h3>
              <p className="text-slate-600">
                Chaque dépôt est enregistré avec horodatage et coordonnées GPS, garantissant une traçabilité totale.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl border border-slate-200 card-shadow hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Rapports Automatiques</h3>
              <p className="text-slate-600">
                Générez des rapports quotidiens et mensuels en un clic pour une clôture de caisse simplifiée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="container px-6 mx-auto text-center text-slate-500">
          <p>© {new Date().getFullYear()} NunyaCollect. Digitalisons la micro-finance.</p>
        </div>
      </footer>
    </div>
  );
}
