'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { useMapContext } from '../context/MapContext';
import { SYMBOLOGY } from '../lib/symbology';

// O MapLibre/Mapbox GL serializa valores de propriedades que são array/objeto como
// string JSON ao processar o GeoJSON internamente (mesmo sem clustering). Por isso,
// campos como `gallery` e `documents` podem chegar como string e precisam ser
// desserializados antes do uso.
function parseArrayProp(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function LocationDetailsPanel() {
  const { selectedLocation, setSelectedLocation, setSelectedDocument } = useMapContext();
  const [activeTab, setActiveTab] = useState('narrativa');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Reseta a aba quando seleciona um novo local
  useEffect(() => {
    if (selectedLocation) {
      setActiveTab('narrativa');
      setLightboxImage(null);
    }
  }, [selectedLocation]);

  if (!selectedLocation) return null;

  const { properties } = selectedLocation;
  const categoryId = properties.category_id || 'portos';
  const category = SYMBOLOGY[categoryId] || SYMBOLOGY.portos;

  const title = properties.title || properties.nome;
  const description = properties.description || properties.descricao;
  const coverImage = properties.cover_image || properties.imagem || null;

  // Aceita tanto `documents` (schema novo) quanto `documentos` (schema legado)
  const documents: Array<{ titulo?: string; title?: string; tipo?: string; type?: string; url: string }> =
    parseArrayProp(properties.documents || properties.documentos);

  // Galeria: usa `gallery` se existir; caso contrário, cai para a imagem de capa
  const parsedGallery = parseArrayProp(properties.gallery);
  const gallery: string[] = parsedGallery.length > 0 ? parsedGallery : (coverImage ? [coverImage] : []);

  const tabs = [
    { id: 'narrativa', label: 'Narrativa', icon: <BookOpen /> },
    { id: 'midia', label: 'Mídia', icon: <ImageIcon /> },
    { id: 'documentos', label: `Documentos${documents.length ? ` (${documents.length})` : ''}`, icon: <FileText /> },
  ];

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
              {title}
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

                {coverImage && (
                  <button
                    onClick={() => setLightboxImage(coverImage)}
                    className="w-full h-56 rounded-xl overflow-hidden border border-white/10 relative group cursor-zoom-in"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                )}
                <p className="text-zinc-300 text-[15px] leading-relaxed text-justify font-serif">
                  {description || 'Nenhuma narrativa histórica detalhada foi registrada para esta entidade no banco de dados.'}
                </p>
              </motion.div>
            )}

            {activeTab === 'midia' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                {gallery.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxImage(img)}
                        className="aspect-square rounded-lg overflow-hidden border border-white/10 group relative cursor-zoom-in"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`${title} - imagem ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm italic">Nenhuma imagem cadastrada para esta entidade.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'documentos' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-semibold">Acervo Relacionado</p>
                {documents.length > 0 ? (
                  documents.map((doc, i) => {
                    const docTitle = doc.title || doc.titulo || 'Documento';
                    const docType = (doc.type || doc.tipo || '').toString();
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDocument({ title: docTitle, type: docType, url: doc.url })}
                        className="flex items-center gap-3 w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 text-zinc-300">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{docTitle}</p>
                          {docType && <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{docType}</p>}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-zinc-500 text-sm italic">Nenhum documento primário atrelado a esta entidade no momento.</p>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </motion.aside>

      {/* Lightbox de imagem */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 cursor-zoom-out pointer-events-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxImage} alt="" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
