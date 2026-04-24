"use client";

import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className={`text-xl font-black tracking-tight ${isScrolled ? "text-slate-900" : "text-white"}`}>
            Nunya<span className="text-emerald-500">Collect</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center space-x-8 text-sm font-bold ${isScrolled ? "text-slate-600" : "text-white/80"}`}>
          <Link href="#features" className="hover:text-emerald-500 transition-colors">Fonctionnalités</Link>
          <Link href="#how-it-works" className="hover:text-emerald-500 transition-colors">Comment ça marche</Link>
          <Link href="#pricing" className="hover:text-emerald-500 transition-colors">Tarifs</Link>
          <Link href="/login" className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all shadow-lg shadow-black/5 active:scale-95">
            Se connecter
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-emerald-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white p-6 shadow-xl border-t border-slate-100 flex flex-col space-y-4 md:hidden"
        >
          <Link href="#features" className="text-slate-600 font-bold">Fonctionnalités</Link>
          <Link href="#how-it-works" className="text-slate-600 font-bold">Comment ça marche</Link>
          <Link href="/login" className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-center font-bold">
            Se connecter
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
