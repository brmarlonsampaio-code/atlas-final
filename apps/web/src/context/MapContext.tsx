'use client';

import React, { createContext, useContext, useState } from 'react';

type LayerId = 'portos-layer' | 'rotas-layer' | 'historical-raster-layer';

interface MapContextProps {
  visibleLayers: Record<LayerId, boolean>;
  toggleLayer: (id: LayerId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const defaultContext: MapContextProps = {
  visibleLayers: {
    'portos-layer': true,
    'rotas-layer': true,
    'historical-raster-layer': true,
  },
  toggleLayer: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
};

const MapContext = createContext<MapContextProps>(defaultContext);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [visibleLayers, setVisibleLayers] = useState<Record<LayerId, boolean>>({
    'portos-layer': true,
    'rotas-layer': true,
    'historical-raster-layer': true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLayer = (id: LayerId) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <MapContext.Provider value={{ visibleLayers, toggleLayer, searchQuery, setSearchQuery }}>
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);
