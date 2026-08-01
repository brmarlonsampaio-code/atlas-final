'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import MapLibre, { Source, Layer, NavigationControl, AttributionControl, MapRef } from 'react-map-gl/maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapContext } from '../context/MapContext';
import { SYMBOLOGY } from '../lib/symbology';

// Estilo do mapa baseado nos tiles públicos do OpenStreetMap (raster),
// conforme https://www.openstreetmap.org/ — requer atribuição visível (ver AttributionControl abaixo).
const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const ROUTE_COLORS: Record<string, string> = {
  trafico: '#DC2626',
  comercio: '#2563EB',
};

export default function Map() {
  const { activeCategories, searchQuery, setSelectedLocation, setSelectedDocument, setEntityStats } = useMapContext();
  const [data, setData] = useState<any>(null);
  const [routes, setRoutes] = useState<any>(null);
  const [isHovering, setIsHovering] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Dados dos pontos (portos, fortificações, quilombos etc.) — backend real (NestJS + PostGIS)
    fetch(`${apiUrl}/entities`)
      .then((res) => res.json())
      .then((json) => {
        // Enriquece cada feature com cor/ícone vindos da simbologia local
        const enriched = {
          ...json,
          features: (json.features || []).map((f: any) => {
            const cat = SYMBOLOGY[f.properties.category_id] || SYMBOLOGY.portos;
            return {
              ...f,
              properties: {
                ...f.properties,
                color: cat.color,
                icon: cat.icon,
              },
            };
          }),
        };
        setData(enriched);

        const stats: Record<string, number> = {};
        enriched.features.forEach((f: any) => {
          const cat = f.properties.category_id;
          if (cat) stats[cat] = (stats[cat] || 0) + 1;
        });
        setEntityStats(stats);
      })
      .catch((err) => console.error('Erro ao buscar entidades:', err));

    // Dados das rotas atlânticas (tráfico e comércio) — backend real
    fetch(`${apiUrl}/routes`)
      .then((res) => res.json())
      .then((json) => {
        const enriched = {
          ...json,
          features: (json.features || []).map((f: any) => ({
            ...f,
            properties: {
              ...f.properties,
              color: ROUTE_COLORS[f.properties.category] || '#94a3b8',
            },
          })),
        };
        setRoutes(enriched);
      })
      .catch((err) => console.error('Erro ao buscar rotas:', err));
  }, [apiUrl, setEntityStats]);

  const filteredData = useMemo(() => {
    if (!data || !data.features) return null;
    return {
      ...data,
      features: data.features.filter((f: any) => {
        const cat = f.properties.category_id || 'portos';
        const matchesCategory = activeCategories.has(cat);
        const matchesSearch =
          !searchQuery || (f.properties.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    };
  }, [data, activeCategories, searchQuery]);

  const handleClick = useCallback(
    async (e: any) => {
      const clusterFeature = e.features?.find((f: any) => f.layer.id === 'clusters');
      if (clusterFeature) {
        // Clique num cluster: aproxima o zoom em vez de abrir o painel lateral
        const map = mapRef.current?.getMap();
        const source = map?.getSource('entities') as any;
        if (map && source && typeof source.getClusterExpansionZoom === 'function') {
          const zoom = await source.getClusterExpansionZoom(clusterFeature.properties.cluster_id);
          map.easeTo({ center: clusterFeature.geometry.coordinates, zoom, duration: 500 });
        }
        return;
      }

      const pointFeature = e.features?.find((f: any) => f.layer.id === 'unclustered-point');
      if (pointFeature) {
        setSelectedDocument(null);
        setSelectedLocation(pointFeature);
      } else {
        setSelectedLocation(null);
      }
    },
    [setSelectedLocation, setSelectedDocument]
  );

  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <MapLibre
        ref={mapRef}
        initialViewState={{ longitude: -25, latitude: 5, zoom: 2.6 }}
        mapStyle={OSM_STYLE}
        attributionControl={false}
        interactiveLayerIds={['unclustered-point', 'clusters']}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        cursor={isHovering ? 'pointer' : 'grab'}
      >
        <NavigationControl position="bottom-right" />
        <AttributionControl position="bottom-left" compact />

        {/* Rotas atlânticas (tráfico e comércio) — estilo "flow map" */}
        {routes && (
          <Source id="rotas" type="geojson" data={routes}>
            <Layer
              id="rotas-linhas"
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': ['get', 'color'],
                'line-width': ['+', ['*', ['get', 'intensity'], 0.8], 1],
                'line-opacity': 0.55,
                'line-dasharray': [2, 1.5],
              }}
            />
          </Source>
        )}

        {/* Pontos (portos, fortificações, quilombos, etc.) */}
        {filteredData && (
          <Source
            id="entities"
            type="geojson"
            data={filteredData}
            cluster={true}
            clusterMaxZoom={7}
            clusterRadius={50}
          >
            {/* Círculo do Cluster */}
            <Layer
              id="clusters"
              type="circle"
              filter={['has', 'point_count']}
              paint={{
                'circle-color': '#1E3A8A',
                'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 30, 32],
                'circle-stroke-width': 2,
                'circle-stroke-color': 'rgba(255,255,255,0.6)',
                'circle-opacity': 0.85,
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
                'text-size': 12,
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
                'circle-radius': 9,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.95,
              }}
            />
            {/* Ícone (Emoji) sobreposto ao círculo */}
            <Layer
              id="unclustered-point-label"
              type="symbol"
              filter={['!', ['has', 'point_count']]}
              layout={{
                'text-field': ['get', 'icon'],
                'text-size': 12,
                'text-allow-overlap': true,
              }}
            />
          </Source>
        )}
      </MapLibre>
    </div>
  );
}
