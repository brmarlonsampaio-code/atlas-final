'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, UploadCloud, X, Lock } from 'lucide-react';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-24 right-6 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full text-zinc-400 hover:text-red-400 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        title="Área Administrativa (Backoffice)"
      >
        <Lock className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-6 z-50 pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Database className="text-red-400 w-6 h-6" />
                <h2 className="text-xl font-bold text-white">Backoffice Científico</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-red-400/50 hover:bg-white/5 transition-all cursor-pointer group">
              <UploadCloud className="w-12 h-12 text-zinc-500 group-hover:text-red-400 mb-4 transition-colors" />
              <p className="text-white font-medium mb-1">Upload de Dataset (GeoJSON)</p>
              <p className="text-xs text-zinc-400">Arraste e solte o arquivo contendo as coordenadas ou shapefiles da pesquisa.</p>
              
              <button 
                className="mt-6 bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/40 transition-colors"
                onClick={(e) => { e.stopPropagation(); setIsUploading(true); setTimeout(() => setIsUploading(false), 2000) }}
              >
                {isUploading ? 'Processando (PostGIS)...' : 'Selecionar Arquivo'}
              </button>
            </div>
            
            <p className="text-[10px] text-zinc-500 text-center mt-4 uppercase tracking-widest">
              Acesso Restrito - Permissões Granulares
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
