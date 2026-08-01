import { NextResponse } from 'next/server';

// Rotas atlânticas de demonstração. `intensity` (1-5) é um valor RELATIVO usado apenas
// para dar espessura/proeminência visual à linha no mapa — não representa uma contagem
// exata de pessoas ou viagens. Para dados quantitativos rigorosos, a referência acadêmica
// é o banco de dados Slave Voyages (slavevoyages.org).

const ROUTES = [
  {
    id: 'uida-salvador',
    origem: 'Uidá (Ouidah)',
    destino: 'Porto de Salvador',
    from: [2.0878, 6.3222],
    to: [-38.5124, -12.9714],
    category: 'trafico',
    intensity: 5,
    note: 'Uma das rotas mais intensas e duradouras do tráfico transatlântico, ligando a Costa da Mina/Golfo do Benim à Bahia por mais de dois séculos.',
  },
  {
    id: 'luanda-valongo',
    origem: 'Porto de Luanda',
    destino: 'Cais do Valongo',
    from: [13.2343, -8.8390],
    to: [-43.187389, -22.897111],
    category: 'trafico',
    intensity: 5,
    note: 'Principal corredor do tráfico transatlântico: a rota entre Angola e o Rio de Janeiro concentrou o maior volume de pessoas escravizadas desembarcadas nas Américas.',
  },
  {
    id: 'luanda-salvador',
    origem: 'Porto de Luanda',
    destino: 'Porto de Salvador',
    from: [13.2343, -8.8390],
    to: [-38.5124, -12.9714],
    category: 'trafico',
    intensity: 3,
    note: 'Rota secundária, mas relevante, entre a África Centro-Ocidental e a Bahia.',
  },
  {
    id: 'elmina-recife',
    origem: 'Castelo de São Jorge da Mina (Elmina)',
    destino: 'Porto do Recife',
    from: [-1.3486, 5.0836],
    to: [-34.8770, -8.0476],
    category: 'comercio',
    intensity: 2,
    note: 'Rota ativa durante o período do Brasil Neerlandês (1630–1654), quando a Companhia das Índias Ocidentais controlava tanto Elmina quanto Pernambuco.',
  },
  {
    id: 'lisboa-salvador',
    origem: 'Porto de Lisboa',
    destino: 'Porto de Salvador',
    from: [-9.1393, 38.7223],
    to: [-38.5124, -12.9714],
    category: 'comercio',
    intensity: 2,
    note: 'Rota administrativa e comercial metropolitana, ligada ao comércio de açúcar e a outras mercadorias coloniais.',
  },
  {
    id: 'lisboa-recife',
    origem: 'Porto de Lisboa',
    destino: 'Porto do Recife',
    from: [-9.1393, 38.7223],
    to: [-34.8770, -8.0476],
    category: 'comercio',
    intensity: 1,
    note: 'Rota comercial metropolitana ligada ao ciclo açucareiro pernambucano.',
  },
];

export async function GET() {
  const geojson = {
    type: 'FeatureCollection',
    features: ROUTES.map((r) => ({
      type: 'Feature',
      properties: {
        id: r.id,
        origem: r.origem,
        destino: r.destino,
        category: r.category,
        intensity: r.intensity,
        note: r.note,
      },
      geometry: {
        type: 'LineString',
        coordinates: [r.from, r.to],
      },
    })),
  };

  return NextResponse.json(geojson);
}
