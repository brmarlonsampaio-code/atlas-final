'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ListFilter } from 'lucide-react';
import { useMapContext } from '../context/MapContext';
import { SYMBOLOGY } from '../lib/symbology';

export default function SmartLegend() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { activeCategories, toggleCategory, entityStats } = useMapContext();

  // Vamos exibir apenas as categorias que existem no banco, ou as principais para demonstração
  const visibleCategories = Object.values(SYMBOLOGY).filter(cat => 
    entityStats[cat.id] !== undefined || ['portos', 'fortificacoes', 'documentos'].includes(cat.id)
  );

  return (
    <div className="absolute bottom-6 left-6 z-10 flex flex-col items-start pointer-events-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden pointer-events-auto shadow-2xl min-w-[240px]"
          >
            <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-white/5">
              <ListFilter className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Legenda Inteligente</span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-2 flex flex-col gap-1">
              {visibleCategories.map(cat => {
                const isActive = activeCategories.has(cat.id);
                const count = entityStats[cat.id] || 0;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg text-sm transition-all ${isActive ? 'bg-white/10 hover:bg-white/20' : 'bg-transparent hover:bg-white/5 opacity-50 hover:opacity-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: cat.color }}>
                        <span className="text-[10px]">{cat.icon}</span>
                      </div>
                      <span className={`font-medium ${isActive ? 'text-white' : 'text-zinc-400'}`}>{cat.name}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-xs font-mono text-zinc-500 bg-black/50 px-2 py-0.5 rounded-full border border-white/5">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="pointer-events-auto bg-black/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors shadow-lg"
      >
        <span className="text-sm font-medium">Filtros & Legenda</span>
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
}
