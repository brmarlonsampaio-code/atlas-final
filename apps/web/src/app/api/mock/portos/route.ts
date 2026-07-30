import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { nome: 'Porto de Lisboa', tipo: 'Metrópole' }, geometry: { type: 'Point', coordinates: [-9.1393, 38.7223] } },
      { type: 'Feature', properties: { nome: 'Porto de Salvador', tipo: 'Colônia' }, geometry: { type: 'Point', coordinates: [-38.5124, -12.9714] } },
      { type: 'Feature', properties: { nome: 'Porto de Luanda', tipo: 'Feitoria' }, geometry: { type: 'Point', coordinates: [13.2343, -8.8390] } },
      { type: 'Feature', properties: { nome: 'Rio de Janeiro', tipo: 'Colônia' }, geometry: { type: 'Point', coordinates: [-43.1729, -22.9068] } },
      { type: 'Feature', properties: { nome: 'Recife', tipo: 'Colônia' }, geometry: { type: 'Point', coordinates: [-34.8770, -8.0476] } },
      { type: 'Feature', properties: { nome: 'Ouidah', tipo: 'Feitoria' }, geometry: { type: 'Point', coordinates: [2.0833, 6.3667] } },
    ]
  };

  return NextResponse.json(data);
}
