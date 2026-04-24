"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Smartphone, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Globe,
  MapPin,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const features = [
  {
    title: "Suivi GPS en temps réel",
    desc: "Visualisez la position de vos collectrices sur le terrain et assurez-vous de la couverture des zones.",
    icon: MapPin,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Zéro Fraude",
    desc: "Validation instantanée des transactions avec notification SMS/Push au client final.",
    icon: Shield,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    title: "Analytiques avancés",
    desc: "Tableaux de bord détaillés pour suivre la performance et les flux financiers quotidiennement.",
    icon: BarChart3,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "Interface Mobile Fluide",
    desc: "Une application conçue pour être utilisée d'une seule main sur le terrain, même avec peu de réseau.",
    icon: Smartphone,
    color: "text-amber-600",
    bg: "bg-amber-50"
  }
];

export default function Home() {
  return (
    <div className="bg-white selection:bg-emerald-100">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black text-white leading-tight"
            >
              Sécurisez chaque centime avec <span className="text-emerald-500">NunyaCollect</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto"
            >
              Digitalisez votre collecte d'épargne. Gérez vos équipes sur le terrain en temps réel et offrez une confiance totale à vos clients.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center group active:scale-95">
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center active:scale-95">
                Voir la démo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest">Pourquoi nous choisir ?</h2>
            <p className="text-4xl lg:text-5xl font-black text-slate-900">Une solution conçue pour le terrain</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
            <div className="relative bg-slate-900 rounded-[40px] p-8 shadow-2xl border border-slate-800">
               <div className="aspect-[16/10] bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 font-bold italic">
                 [Capture d'écran du Dashboard Admin]
               </div>
            </div>
          </div>
          
          <div className="space-y-10">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">Gérez vos équipes depuis votre bureau</h2>
            <div className="space-y-6">
              {[
                "Affectez des zones de collecte précises",
                "Suivez les dépôts et retraits en temps réel",
                "Gérez vos clients et leurs soldes",
                "Générez des rapports comptables automatiques"
              ].map((text, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="mt-1 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-slate-700 font-bold">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-24 bg-emerald-600 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-white text-3xl lg:text-5xl font-black mb-12">Faites confiance à la technologie Nunya</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-white/80 p-8 border border-white/20 rounded-3xl backdrop-blur-sm">
              <p className="text-4xl font-black text-white mb-2">99.9%</p>
              <p className="text-xs font-bold uppercase tracking-widest">Disponibilité</p>
            </div>
            <div className="text-white/80 p-8 border border-white/20 rounded-3xl backdrop-blur-sm">
              <p className="text-4xl font-black text-white mb-2">256-bit</p>
              <p className="text-xs font-bold uppercase tracking-widest">Chiffrement AES</p>
            </div>
            <div className="text-white/80 p-8 border border-white/20 rounded-3xl backdrop-blur-sm">
              <p className="text-4xl font-black text-white mb-2">+150</p>
              <p className="text-xs font-bold uppercase tracking-widest">Collectrices actives</p>
            </div>
            <div className="text-white/80 p-8 border border-white/20 rounded-3xl backdrop-blur-sm">
              <p className="text-4xl font-black text-white mb-2">Instant</p>
              <p className="text-xs font-bold uppercase tracking-widest">Alertes SMS</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight">Prêt à moderniser votre collecte ?</h2>
          <p className="text-xl text-slate-500">Rejoignez les dizaines de sociétés de micro-finance qui nous font déjà confiance.</p>
          <div className="pt-6">
            <Link href="/register" className="inline-flex items-center px-12 py-6 bg-emerald-600 text-white rounded-[24px] font-black text-xl hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all hover:-translate-y-1">
              Démarrer maintenant
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
