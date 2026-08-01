'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, ExternalLink, Quote, Check } from 'lucide-react';
import { useMapContext } from '../context/MapContext';

export default function DocumentViewer() {
  const { selectedDocument, setSelectedDocument, selectedLocation } = useMapContext();
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Fecha automaticamente a citação copiada ao trocar de documento
  useEffect(() => setCopiedQuote(false), [selectedDocument]);

  if (!selectedDocument) return null;

  const { title, type, url } = selectedDocument;
  const isPdf = url?.toLowerCase().endsWith('.pdf');
  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(url || '');
  const localName = selectedLocation?.properties?.title || selectedLocation?.properties?.nome || 'Atlas Histórico Digital do Atlântico e das Diásporas';

  const generateCitation = () => {
    const year = new Date().getFullYear();
    const citation = `${title}. In: Atlas Histórico Digital do Atlântico e das Diásporas — ${localName}. Acesso em ${year}.`;
    navigator.clipboard.writeText(citation);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.aside
        key={url}
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 w-full md:w-[420px] h-full z-30 p-0 md:p-6 flex flex-col pointer-events-none"
      >
        <div className="flex-1 bg-black/85 backdrop-blur-3xl md:border border-white/10 md:rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden pointer-events-auto">

          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-white font-serif truncate">
                {title}
              </h2>
              {type && <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide">{type}</p>}
            </div>
            <button
              onClick={() => setSelectedDocument(null)}
              className="text-zinc-400 hover:text-white transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de visualização do documento */}
          <div className="relative flex-1 bg-black/80 rounded-lg border border-white/5 overflow-hidden">
            {isPdf && (
              <iframe src={url} title={title} className="w-full h-full" />
            )}
            {!isPdf && isImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={title} className="object-contain w-full h-full" />
            )}
            {!isPdf && !isImage && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                <FileText className="w-10 h-10 text-zinc-600" />
                <p className="text-sm text-zinc-400">Pré-visualização não disponível para este tipo de arquivo.</p>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-md text-white transition-colors w-full justify-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir em nova aba
            </a>
            <button
              onClick={generateCitation}
              className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-md text-white transition-colors w-full justify-center"
            >
              {copiedQuote ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Quote className="w-3.5 h-3.5" />}
              {copiedQuote ? 'Citação copiada' : 'Copiar citação'}
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
