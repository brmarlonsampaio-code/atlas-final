'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ZoomIn, Info, X, ChevronRight, Languages } from 'lucide-react';

export default function DocumentViewer() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button if closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full text-white hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <FileText className="w-5 h-5" />
        </button>
      )}

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 w-96 h-full z-10 p-6 flex flex-col justify-between"
          >
            <div className="flex-1 bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden pointer-events-auto">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white font-serif">
                    Carta de Alforria
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Rio de Janeiro, 1792</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Document Image Area (Mock IIIF Viewer) */}
              <div className="relative flex-1 bg-black/80 rounded-lg border border-white/5 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/manuscript.jpg" 
                  alt="Manuscrito Histórico" 
                  className="object-cover w-full h-full opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 cursor-zoom-in"
                />
                
                {/* Floating Tools over Document */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-white hover:text-blue-400 transition-colors"><ZoomIn className="w-4 h-4" /></button>
                  <button className="text-white hover:text-blue-400 transition-colors"><Languages className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Metadata & OCR Tabs */}
              <div className="h-48 bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col gap-3 overflow-y-auto hide-scrollbar">
                <div className="flex gap-4 border-b border-white/10 pb-2">
                  <button className="text-xs font-bold text-white border-b-2 border-blue-500 pb-1">Metadados</button>
                  <button className="text-xs font-medium text-zinc-500 hover:text-zinc-300">Transcrição (IA)</button>
                </div>
                
                <div className="text-xs text-zinc-300 space-y-2">
                  <p><span className="font-bold text-zinc-400">Fundo:</span> Arquivo Nacional</p>
                  <p><span className="font-bold text-zinc-400">Coleção:</span> Códice 123</p>
                  <p><span className="font-bold text-zinc-400">Idioma:</span> Português Arcaico</p>
                  <p className="pt-2 border-t border-white/5 leading-relaxed">
                    &quot;Declaro que concedo a liberdade a meu escravo João, por bons serviços prestados...&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
