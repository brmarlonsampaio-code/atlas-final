'use client';

import React, { useState, useMemo, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ArcLayer, BitmapLayer } from '@deck.gl/layers';
import { Map as MapLibre } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapContext } from '../context/MapContext';

const INITIAL_VIEW_STATE = { longitude: -30.0, latitude: 15.0, zoom: 3, pitch: 45, bearing: 0 };
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

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
    
    if (visibleLayers['historical-raster-layer']) {
      active.push(new BitmapLayer({
        id: 'historical-raster-layer',
        bounds: [-60, -35, -30, 5],
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/1550_map_of_South_America_by_Pierre_Desceliers.jpg',
        opacity: 0.35,
        pickable: false,
      }));
    }

    if (visibleLayers['portos-layer'] && filteredPortos) {
      active.push(new GeoJsonLayer({
        id: 'portos-layer',
        data: filteredPortos,
        pickable: true,
        stroked: false,
        filled: true,
        extruded: false,
        pointType: 'circle',
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: [66, 135, 245, 200],
        getPointRadius: 100,
        pointRadiusMinPixels: 6,
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
        getSourceColor: [239, 68, 68, 200],
        getTargetColor: [59, 130, 246, 200],
        getWidth: (d: any) => Math.max(1.5, d.volume / 8000),
        onHover: (info: any) => setHoverInfo(info)
      }));
    }

    return active;
  }, [visibleLayers, filteredPortos, rotasData]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
        <MapLibre mapStyle={MAP_STYLE} attributionControl={false} />
        {hoverInfo && hoverInfo.object && (
          <div style={{
            position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y,
            backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', padding: '8px', borderRadius: '4px',
            fontSize: '12px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {hoverInfo.layer.id === 'portos-layer' ? (
              <>
                <p className="font-bold">{hoverInfo.object.properties.nome}</p>
                <p className="text-zinc-300">{hoverInfo.object.properties.tipo}</p>
              </>
            ) : (
              <>
                <p className="font-bold text-red-300">Origem: <span className="font-normal text-white">{hoverInfo.object.origem}</span></p>
                <p className="font-bold text-blue-300">Destino: <span className="font-normal text-white">{hoverInfo.object.destino}</span></p>
                <p className="text-zinc-400 mt-1">Magnitude: {hoverInfo.object.volume.toLocaleString()}</p>
              </>
            )}
          </div>
        )}
      </DeckGL>
    </div>
  );
}
