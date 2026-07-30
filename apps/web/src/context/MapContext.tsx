'use client';

import React, { createContext, useContext, useState } from 'react';
import { SYMBOLOGY } from '../lib/symbology';

interface MapContextProps {
  activeCategories: Set<string>;
  toggleCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: any | null;
  setSelectedLocation: (location: any | null) => void;
  entityStats: Record<string, number>;
  setEntityStats: (stats: Record<string, number>) => void;
}

const defaultContext: MapContextProps = {
  activeCategories: new Set(Object.keys(SYMBOLOGY)),
  toggleCategory: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  selectedLocation: null,
  setSelectedLocation: () => {},
  entityStats: {},
  setEntityStats: () => {},
};

const MapContext = createContext<MapContextProps>(defaultContext);

export function MapProvider({ children }: { children: React.ReactNode }) {
  // Por padrão, todas as categorias começam ativadas
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(Object.keys(SYMBOLOGY)));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [entityStats, setEntityStats] = useState<Record<string, number>>({});

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <MapContext.Provider value={{ activeCategories, toggleCategory, searchQuery, setSearchQuery, selectedLocation, setSelectedLocation, entityStats, setEntityStats }}>
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);
