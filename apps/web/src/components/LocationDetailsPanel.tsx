'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, MapPin, GraduationCap, Image as ImageIcon, Link as LinkIcon, Network } from 'lucide-react';
import { useMapContext } from '../context/MapContext';
import { SYMBOLOGY } from '../lib/symbology';

export default function LocationDetailsPanel() {
  const { selectedLocation, setSelectedLocation } = useMapContext();
  const [activeTab, setActiveTab] = useState('narrativa');

  // Reseta a aba quando seleciona um novo local
  useEffect(() => {
    if (selectedLocation) setActiveTab('narrativa');
  }, [selectedLocation]);

  if (!selectedLocation) return null;

  const { properties } = selectedLocation;
  const categoryId = properties.category_id || 'portos';
  const category = SYMBOLOGY[categoryId] || SYMBOLOGY.portos;

  // Define abas dinâmicas baseadas na categoria
  const getTabs = () => {
    const tabs = [{ id: 'narrativa', label: 'Narrativa', icon: <BookOpen /> }];
    
    if (['documentos', 'cartas'].includes(categoryId)) {
      tabs.push({ id: 'transcricao', label: 'Transcrição', icon: <FileText /> });
      tabs.push({ id: 'referencias', label: 'Referências', icon: <LinkIcon /> });
    } else if (['objetos'].includes(categoryId)) {
      tabs.push({ id: 'midia', label: 'Mídia (3D)', icon: <ImageIcon /> });
    } else {
      // Padrão para portos, locais, quilombos
      tabs.push({ id: 'midia', label: 'Mídia', icon: <ImageIcon /> });
      tabs.push({ id: 'documentos', label: 'Documentos', icon: <FileText /> });
      tabs.push({ id: 'relacoes', label: 'Conexões', icon: <Network /> });
    }
    
    return tabs;
  };

  const tabs = getTabs();

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        // Responsivo: 100% no celular, 35% no Desktop
        className="absolute top-0 right-0 w-full md:w-[35%] h-full z-20 p-0 md:p-6 flex flex-col pointer-events-none"
      >
        <div className="flex-1 bg-black/85 backdrop-blur-3xl md:border border-white/10 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 relative">
            <button 
              onClick={() => setSelectedLocation(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/20 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3" style={{ color: category.color }}>
              <span className="text-sm">{category.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest">{category.name}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight mb-2">
              {properties.title || properties.nome}
            </h2>
            {properties.subtitle && (
              <p className="text-zinc-400 text-sm font-medium">{properties.subtitle}</p>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-none">
            {tabs.map(tab => (
              <TabButton 
                key={tab.id}
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                icon={tab.icon} 
                label={tab.label} 
                color={category.color}
              />
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            
            {activeTab === 'narrativa' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                
                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4">
                  {properties.period && (
                    <div className="flex flex-col"><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Período</span><span className="text-zinc-300 text-sm">{properties.period}</span></div>
                  )}
                  {properties.culture && (
                    <div className="flex flex-col"><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Cultura/Povo</span><span className="text-zinc-300 text-sm">{properties.culture}</span></div>
                  )}
                  {properties.country && (
                    <div className="flex flex-col"><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">País Atual</span><span className="text-zinc-300 text-sm">{properties.country}</span></div>
                  )}
                </div>

                {properties.cover_image && (
                  <div className="w-full h-56 rounded-xl overflow-hidden border border-white/10 relative group">
                    <img src={properties.cover_image} alt={properties.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                  </div>
                )}
                <p className="text-zinc-300 text-[15px] leading-relaxed text-justify font-serif">
                  {properties.description || properties.descricao || 'Nenhuma narrativa histórica detalhada foi registrada para esta entidade no banco de dados.'}
                </p>
              </motion.div>
            )}

            {activeTab === 'midia' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <p className="text-zinc-500 text-sm italic">Galeria de mídias e visualizador IIIF/3D será renderizado aqui...</p>
              </motion.div>
            )}

            {activeTab === 'documentos' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Acervo Relacionado</p>
                <p className="text-zinc-500 text-sm italic">Nenhum documento primário atrelado a esta entidade no momento.</p>
              </motion.div>
            )}

            {activeTab === 'relacoes' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Conexões Históricas</p>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                  <p className="text-zinc-400 text-sm text-center">Nenhuma relação georreferenciada (N:N) encontrada para traçar rotas a partir deste ponto.</p>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function TabButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 text-xs transition-colors border-b-2 whitespace-nowrap px-4 min-w-[80px]`}
      style={{
        borderColor: active ? color : 'transparent',
        color: active ? '#fff' : '#71717a',
        backgroundColor: active ? `${color}10` : 'transparent'
      }}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' } as any)}
      <span className="font-medium">{label}</span>
    </button>
  );
}
