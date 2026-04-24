import Link from "next/link";
import { Shield, Mail, Phone, Globe, MessageCircle, Share2, Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Nunya<span className="text-emerald-500">Collect</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed opacity-70">
            Digitaliser, tracer et sécuriser la collecte d'épargne sur les marchés en temps réel. La solution complète pour les sociétés de micro-finance modernes.
          </p>
          <div className="flex space-x-4">
            <Share2 className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors" />
            <MessageCircle className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors" />
            <Globe className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors" />
            <Info className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Produit</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="#features" className="hover:text-emerald-500 transition-colors">Fonctionnalités</Link></li>
            <li><Link href="#how-it-works" className="hover:text-emerald-500 transition-colors">Comment ça marche</Link></li>
            <li><Link href="/dashboard" className="hover:text-emerald-500 transition-colors">Interface Admin</Link></li>
            <li><Link href="/accueil" className="hover:text-emerald-500 transition-colors">App Mobile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Entreprise</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">À propos</Link></li>
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Partenaires</Link></li>
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Confidentialité</Link></li>
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6">Contact</h4>
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="w-5 h-5 text-emerald-500" />
            <span>contact@nunyacollect.com</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Phone className="w-5 h-5 text-emerald-500" />
            <span>+228 90 00 00 00</span>
          </div>
          <div className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-xs font-bold text-white mb-2">Inscrivez-vous à la newsletter</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-slate-700 border-none rounded-l-lg text-xs w-full px-3" />
              <button className="bg-emerald-600 text-white px-3 py-2 rounded-r-lg text-xs font-bold">Go</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-col md:flex-row justify-between items-center text-xs opacity-50 space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} NunyaCollect. Tous droits réservés.</p>
        <div className="flex space-x-6">
          <Link href="#">CGU</Link>
          <Link href="#">Mentions Légales</Link>
        </div>
      </div>
    </footer>
  );
}
