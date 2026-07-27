'use client';

import React, { useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ArcLayer, BitmapLayer } from '@deck.gl/layers';
import { Map as MapLibre } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const INITIAL_VIEW_STATE = {
  longitude: -30.0,
  latitude: 15.0,
  zoom: 3,
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function Map() {
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  const layers = useMemo(() => [
    new BitmapLayer({
      id: 'historical-raster-layer',
      bounds: [-60, -35, -30, 5],
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/1550_map_of_South_America_by_Pierre_Desceliers.jpg',
      opacity: 0.35,
      pickable: false,
    }),
    new GeoJsonLayer({
      id: 'portos-layer',
      data: 'http://localhost:3001/lugares/mock/portos',
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
    }),
    new ArcLayer({
      id: 'rotas-layer',
      data: 'http://localhost:3001/lugares/mock/rotas',
      pickable: true,
      getSourcePosition: (d: any) => d.from,
      getTargetPosition: (d: any) => d.to,
      getSourceColor: [239, 68, 68, 200], // Tailwind red-500
      getTargetColor: [59, 130, 246, 200], // Tailwind blue-500
      getWidth: (d: any) => Math.max(1.5, d.volume / 8000), // Scale width by volume
      onHover: (info: any) => setHoverInfo(info)
    })
  ], []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <MapLibre
          mapStyle={MAP_STYLE}
          attributionControl={false}
        />
        {hoverInfo && hoverInfo.object && (
          <div style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            left: hoverInfo.x,
            top: hoverInfo.y,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)'
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
