'use client';

import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

// Mock data for the timeline
const TIMELINE_EVENTS = [
  { id: 1, year: 1482, title: "Fundação de São Jorge da Mina" },
  { id: 2, year: 1532, title: "Início da Colonização do Brasil" },
  { id: 3, year: 1580, title: "União Ibérica" },
  { id: 4, year: 1630, title: "Invasões Holandesas no Nordeste" },
  { id: 5, year: 1791, title: "Revolução do Haiti" },
  { id: 6, year: 1888, title: "Abolição da Escravatura no Brasil" }
];

export default function Timeline() {
  const width = 1200; // Conceptual width for scale
  
  // Create a time scale from 1400 to 1900
  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([1400, 1900])
      .range([50, width - 50]);
  }, [width]);

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-5xl h-32 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10 p-4 flex flex-col justify-end overflow-hidden"
    >
      {/* Título/Info da Timeline */}
      <div className="absolute top-4 left-6 text-white font-serif">
        <h2 className="text-lg font-bold">Cronologia Atlântica</h2>
        <p className="text-xs text-zinc-400">História no Tempo</p>
      </div>

      {/* Container de Rolagem Horizontal */}
      <div className="relative w-full h-16 overflow-x-auto hide-scrollbar flex items-end pb-2">
        <div style={{ width: `${width}px`, minWidth: '100%', position: 'relative', height: '100%' }}>
          
          {/* Linha base do Eixo X */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" />

          {/* Renderizando os Eventos */}
          {TIMELINE_EVENTS.map(event => {
            const xPos = xScale(event.year);
            return (
              <div 
                key={event.id}
                className="absolute flex flex-col items-center group cursor-pointer"
                style={{ left: `${xPos}px`, bottom: 0, transform: 'translateX(-50%)' }}
              >
                {/* Linha vertical do marcador */}
                <div className="w-[1px] h-6 bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                
                {/* Ponto / Nó */}
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-black group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                
                {/* Texto (Tooltip) */}
                <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md px-3 py-1.5 rounded text-white text-xs whitespace-nowrap border border-white/10 pointer-events-none z-20">
                  <span className="font-bold text-blue-300 mr-2">{event.year}</span>
                  {event.title}
                </div>
              </div>
            );
          })}

          {/* Marcadores de Século */}
          {[1400, 1500, 1600, 1700, 1800, 1900].map(century => (
            <div 
              key={century}
              className="absolute bottom-0 text-[10px] text-zinc-500 font-mono -translate-x-1/2 translate-y-full pt-1"
              style={{ left: `${xScale(century)}px` }}
            >
              {century}
            </div>
          ))}

        </div>
      </div>
    </motion.div>
  );
}
