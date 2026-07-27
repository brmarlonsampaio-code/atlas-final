'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, X } from 'lucide-react';

const mockVoyageData = [
  { decade: '1500s', viagens: 120, volume: 15000 },
  { decade: '1600s', viagens: 450, volume: 80000 },
  { decade: '1700s', viagens: 1200, volume: 300000 },
  { decade: '1800s', viagens: 800, volume: 150000 }
];

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão de Ativação do Dashboard */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 left-80 ml-6 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full text-white hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        title="Abrir Painel Analítico"
      >
        <BarChart3 className="w-5 h-5" />
      </button>

      {/* Painel Retrátil Deslizante */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -400, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-20 left-80 ml-6 w-[700px] h-[360px] z-10 p-6 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 pointer-events-auto"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white font-serif">Painel Analítico Científico</h2>
                <p className="text-xs text-zinc-400">Distribuição temporal das rotas marítimas (Série Histórica)</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Gráfico 1: Volume */}
              <div className="bg-white/5 border border-white/5 rounded-lg p-4 flex flex-col">
                <h3 className="text-xs font-bold text-zinc-300 mb-4">Volume (Pessoas/Carga)</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockVoyageData}>
                      <XAxis dataKey="decade" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico 2: Viagens */}
              <div className="bg-white/5 border border-white/5 rounded-lg p-4 flex flex-col">
                <h3 className="text-xs font-bold text-zinc-300 mb-4">Número de Viagens Registradas</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockVoyageData}>
                      <XAxis dataKey="decade" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#ef4444' }}
                      />
                      <Line type="monotone" dataKey="viagens" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
