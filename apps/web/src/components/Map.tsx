'use client';

import React, { useEffect, useState, useMemo } from 'react';
import MapLibre, { Source, Layer, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapContext } from '../context/MapContext';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function Map() {
  const { activeCategories, searchQuery, setSelectedLocation, setEntityStats } = useMapContext();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Busca dados do novo backend NestJS (ajustar porta se necessário)
    fetch('http://localhost:3001/entities')
      .then(res => res.json())
      .then(json => {
        setData(json);
        
        // Calcula contagem para a legenda inteligente
        const stats: Record<string, number> = {};
        if (json.features) {
          json.features.forEach((f: any) => {
            // No schema, categorias múltiplas podem existir, mas para o mapa principal
            // usamos a primary category que mockamos
            const cat = f.properties.category_name?.toLowerCase();
            if (cat) {
              stats[cat] = (stats[cat] || 0) + 1;
            }
          });
        }
        setEntityStats(stats);
      })
      .catch(err => {
        console.error('Erro ao buscar entidades:', err);
        // Fallback de dados para demonstração se o backend estiver offline
        const fallback = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                id: '1', title: 'Porto de Salvador', category_id: 'portos',
                color: '#2563EB', icon: '⚓'
              },
              geometry: { type: 'Point', coordinates: [-38.5124, -12.9714] }
            },
            {
              type: 'Feature',
              properties: {
                id: '2', title: 'Forte de São Marcelo', category_id: 'fortificacoes',
                color: '#B91C1C', icon: '🏰'
              },
              geometry: { type: 'Point', coordinates: [-38.5164, -12.9734] }
            }
          ]
        };
        setData(fallback);
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!data || !data.features) return null;
    return {
      ...data,
      features: data.features.filter((f: any) => {
        const cat = f.properties.category_id || 'portos';
        const matchesCategory = activeCategories.has(cat);
        const matchesSearch = !searchQuery || f.properties.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    };
  }, [data, activeCategories, searchQuery]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <MapLibre
        initialViewState={{ longitude: -30, latitude: 15, zoom: 3, pitch: 45 }}
        mapStyle={MAP_STYLE}
        interactiveLayerIds={['unclustered-point']}
        onClick={(e) => {
          if (e.features && e.features.length > 0) {
             const feature = e.features[0];
             setSelectedLocation(feature);
          } else {
             setSelectedLocation(null);
          }
        }}
        cursor={activeCategories ? 'grab' : 'pointer'}
      >
        {filteredData && (
          <Source
            id="entities"
            type="geojson"
            data={filteredData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            {/* Círculo do Cluster */}
            <Layer
              id="clusters"
              type="circle"
              filter={['has', 'point_count']}
              paint={{
                'circle-color': '#1E3A8A',
                'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                'circle-stroke-width': 2,
                'circle-stroke-color': 'rgba(255,255,255,0.5)',
                'circle-opacity': 0.8
              }}
            />
            {/* Texto do Cluster */}
            <Layer
              id="cluster-count"
              type="symbol"
              filter={['has', 'point_count']}
              layout={{
                'text-field': '{point_count_abbreviated}',
                'text-font': ['Arial Unicode MS Bold'],
                'text-size': 12
              }}
              paint={{ 'text-color': '#ffffff' }}
            />
            {/* Ponto individual (Círculo colorido pela categoria) */}
            <Layer
              id="unclustered-point"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              paint={{
                'circle-color': ['get', 'color'],
                'circle-radius': 14,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.9
              }}
            />
            {/* Ícone (Emoji) sobreposto ao círculo */}
             <Layer
              id="unclustered-point-label"
              type="symbol"
              filter={['!', ['has', 'point_count']]}
              layout={{
                'text-field': ['get', 'icon'],
                'text-size': 14,
                'text-allow-overlap': true
              }}
            />
          </Source>
        )}
      </MapLibre>
    </div>
  );
}
