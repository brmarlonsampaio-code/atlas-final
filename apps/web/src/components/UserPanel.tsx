'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, Save, Settings, X, Globe2 } from 'lucide-react';

export default function UserPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 right-20 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full text-zinc-400 hover:text-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        title="Área do Pesquisador (Autenticação)"
      >
        <User className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="absolute top-20 right-6 w-80 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-6 z-50 pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white font-serif">Espaço Acadêmico</h2>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-zinc-400 mb-2">Faça login com sua instituição (ORCID) ou Google para salvar narrativas e mapas espaciais.</p>
                <button 
                  onClick={() => setIsAuthenticated(true)}
                  className="flex items-center justify-center gap-2 w-full bg-white/10 border border-white/20 text-white p-2 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  <Globe2 className="w-4 h-4" /> Entrar com ORCID
                </button>
                <button 
                  onClick={() => setIsAuthenticated(true)}
                  className="flex items-center justify-center gap-2 w-full bg-white text-black p-2 rounded-lg hover:bg-zinc-200 transition-colors text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" /> Entrar com Google
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    DS
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Dr. Silva</p>
                    <p className="text-xs text-zinc-400">Pesquisador Titular</p>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <button className="flex items-center gap-3 w-full text-left text-zinc-300 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors text-sm">
                    <Save className="w-4 h-4" /> Salvar Estado do Mapa
                  </button>
                  <button className="flex items-center gap-3 w-full text-left text-zinc-300 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors text-sm">
                    <Settings className="w-4 h-4" /> Preferências de Camadas
                  </button>
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="flex items-center gap-3 w-full text-left text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded-lg transition-colors text-sm"
                  >
                    <LogIn className="w-4 h-4 rotate-180" /> Sair
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
