'use client';

import React, { useState, useMemo, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { _GlobeView as GlobeView } from '@deck.gl/core';
import { GeoJsonLayer, ArcLayer, BitmapLayer } from '@deck.gl/layers';
import { useMapContext } from '../context/MapContext';

const INITIAL_VIEW_STATE = { longitude: -30.0, latitude: 15.0, zoom: 2, pitch: 15, bearing: 0 };

export default function Map() {
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const { visibleLayers, searchQuery } = useMapContext();
  
  const [portosData, setPortosData] = useState<any>(null);
  const [rotasData, setRotasData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/mock/portos').then(res => res.json()).then(setPortosData);
    fetch('/api/mock/rotas').then(res => res.json()).then(setRotasData);
  }, []);

  const filteredPortos = useMemo(() => {
    if (!portosData) return null;
    if (!searchQuery) return portosData;
    return {
      ...portosData,
      features: portosData.features.filter((f: any) => 
        f.properties.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.properties.tipo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  }, [portosData, searchQuery]);

  const layers = useMemo(() => {
    const active = [];
    
    // Camada Base da Terra (Substitui o MapLibre) - NASA Blue Marble
    active.push(new BitmapLayer({
      id: 'earth-base-layer',
      bounds: [-180, -90, 180, 90],
      image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/images/earth-blue-marble.jpg',
      pickable: false,
    }));

    if (visibleLayers['historical-raster-layer']) {
      active.push(new BitmapLayer({
        id: 'historical-raster-layer',
        bounds: [-60, -35, -30, 5],
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/1550_map_of_South_America_by_Pierre_Desceliers.jpg',
        opacity: 0.7,
        pickable: false,
      }));
    }

    if (visibleLayers['portos-layer'] && filteredPortos) {
      active.push(new GeoJsonLayer({
        id: 'portos-layer',
        data: filteredPortos,
        pickable: true,
        stroked: true,
        getLineColor: [255, 255, 255, 255],
        lineWidthMinPixels: 1,
        filled: true,
        extruded: false,
        pointType: 'circle',
        getFillColor: [66, 135, 245, 255],
        getPointRadius: 200000, // Tamanho adaptado para o globo em metros
        pointRadiusMinPixels: 4,
        pointRadiusMaxPixels: 20,
        onHover: (info: any) => setHoverInfo(info)
      }));
    }

    if (visibleLayers['rotas-layer'] && rotasData) {
      active.push(new ArcLayer({
        id: 'rotas-layer',
        data: rotasData,
        pickable: true,
        getSourcePosition: (d: any) => d.from,
        getTargetPosition: (d: any) => d.to,
        getSourceColor: [239, 68, 68, 255],
        getTargetColor: [59, 130, 246, 255],
        getWidth: (d: any) => Math.max(2, d.volume / 4000),
        onHover: (info: any) => setHoverInfo(info)
      }));
    }

    return active;
  }, [visibleLayers, filteredPortos, rotasData]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#030508] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a121c] via-[#030508] to-black">
      <DeckGL 
        views={new GlobeView()}
        initialViewState={INITIAL_VIEW_STATE} 
        controller={true} 
        layers={layers}
      >
        {hoverInfo && hoverInfo.object && (
          <div style={{
            position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y,
            backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff', padding: '12px', borderRadius: '8px',
            fontSize: '13px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
          }}>
            {hoverInfo.layer.id === 'portos-layer' ? (
              <>
                <p className="font-bold text-lg mb-1 text-white">{hoverInfo.object.properties.nome}</p>
                <p className="text-zinc-400 uppercase tracking-widest text-[10px] font-bold">{hoverInfo.object.properties.tipo}</p>
              </>
            ) : (
              <>
                <p className="font-bold text-red-300">Origem: <span className="font-normal text-white">{hoverInfo.object.origem}</span></p>
                <p className="font-bold text-blue-300">Destino: <span className="font-normal text-white">{hoverInfo.object.destino}</span></p>
                <p className="text-zinc-500 mt-2 font-mono text-[11px] uppercase">Magnitude: <span className="text-zinc-300">{hoverInfo.object.volume.toLocaleString()} tons</span></p>
              </>
            )}
          </div>
        )}
      </DeckGL>
    </div>
  );
}
