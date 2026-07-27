'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Search, Clock, Compass } from 'lucide-react';

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute top-0 left-0 w-80 h-full z-10 p-6 flex flex-col gap-6"
    >
      <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 font-serif">
            Atlas Histórico
          </h1>
          <p className="text-sm text-zinc-400">Atlântico e das Diásporas</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Buscar lugares, pessoas..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<Compass />} label="Explorar Mapa" active />
          <NavItem icon={<Layers />} label="Camadas Temáticas" />
          <NavItem icon={<Clock />} label="Linha do Tempo" />
        </nav>

        <div className="mt-auto">
          <div className="bg-blue-500/20 text-blue-300 text-xs px-3 py-2 rounded-lg border border-blue-500/20">
            Modo Pesquisador Ativo
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-sm ${active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' } as any)}
      <span>{label}</span>
    </button>
  );
}
