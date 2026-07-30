import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    type: 'FeatureCollection',
    features: [
      { 
        type: 'Feature', 
        properties: { 
          nome: 'Porto de Salvador', 
          tipo: 'Colônia Principal',
          descricao: 'Primeira capital do Brasil colônia (1549-1763) e um dos principais portos de entrada no comércio transatlântico e rotas açucareiras.',
          imagem: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Salvador_no_s%C3%A9culo_XVIII.jpg',
          documentos: [
            { titulo: 'Carta de Doação da Capitania (1534)', tipo: 'Manuscrito', url: '#' },
            { titulo: 'Registros da Alfândega (1750)', tipo: 'Arquivo Histórico', url: '#' },
            { titulo: 'Diário de Navegação da Frota da Bahia', tipo: 'Transcrição', url: '#' }
          ],
          didatico: [
            { titulo: 'Plano de Aula: Economia Açucareira', tipo: 'PDF Educacional', url: '#' },
            { titulo: 'Mapa Interativo da Baía de Todos-os-Santos', tipo: 'Multimídia', url: '#' }
          ]
        }, 
        geometry: { type: 'Point', coordinates: [-38.5124, -12.9714] } 
      },
      { 
        type: 'Feature', 
        properties: { 
          nome: 'Porto de Lisboa', 
          tipo: 'Metrópole Administrativa',
          descricao: 'Centro nervoso do Império Ultramarino. Do Cais da Ribeira partiram as frotas que estabeleceram conexões mercantis com a África e as Américas.',
          imagem: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Lisbon_16th_century.jpg',
          documentos: [
            { titulo: 'Regimento das Naus da Índia (1570)', tipo: 'Impressão de Época', url: '#' },
            { titulo: 'Alvará Régio sobre Comércio de Especiarias', tipo: 'Decreto Régio', url: '#' }
          ],
          didatico: [
            { titulo: 'Guia de Estudos: A Casa da Índia', tipo: 'Apostila Escolar', url: '#' }
          ]
        }, 
        geometry: { type: 'Point', coordinates: [-9.1393, 38.7223] } 
      },
      { type: 'Feature', properties: { nome: 'Porto de Luanda', tipo: 'Feitoria Africana', descricao: 'Ponto estratégico vital nas dinâmicas de trocas no Atlântico Sul e principal porto de saída de africanos escravizados para o Brasil.', documentos: [], didatico: [] }, geometry: { type: 'Point', coordinates: [13.2343, -8.8390] } },
      { type: 'Feature', properties: { nome: 'Rio de Janeiro', tipo: 'Colônia / Capital', descricao: 'Porto que ascendeu economicamente no século XVIII com o ciclo do ouro e se tornou a capital em 1763.', documentos: [], didatico: [] }, geometry: { type: 'Point', coordinates: [-43.1729, -22.9068] } },
      { type: 'Feature', properties: { nome: 'Recife', tipo: 'Porto Comercial', descricao: 'Um dos mais ricos portos do mundo durante a ocupação holandesa (Nova Holanda) e ciclo inicial do açúcar.', documentos: [], didatico: [] }, geometry: { type: 'Point', coordinates: [-34.8770, -8.0476] } },
      { type: 'Feature', properties: { nome: 'Ouidah', tipo: 'Feitoria Africana', descricao: 'Famoso "Forte de São João Batista de Ajudá", representava a intersecção entre o poder europeu e os reinos locais na Costa da Mina.', documentos: [], didatico: [] }, geometry: { type: 'Point', coordinates: [2.0833, 6.3667] } },
    ]
  };

  return NextResponse.json(data);
}
