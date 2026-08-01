import { NextResponse } from 'next/server';

// Fonte de dados de demonstração do Atlas Histórico Digital do Atlântico e das Diásporas.
// Estrutura pensada para ser facilmente substituída pelo backend real (NestJS + PostGIS)
// mantendo o mesmo formato de propriedades esperado pelo frontend.
//
// category_id deve corresponder a uma chave existente em `src/lib/symbology.ts`.

function wm(file: string) {
  // Wikimedia Commons: Special:FilePath resolve para o arquivo de imagem real,
  // sem depender de conhecer o hash de diretório do upload.
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;
}

const FEATURES = [
  {
    id: 'porto-salvador',
    title: 'Porto de Salvador',
    subtitle: 'Bahia, Brasil',
    category_id: 'portos',
    period: 'Século XVI – XIX',
    country: 'Brasil',
    description:
      'Fundada em 1549 como sede do Governo-Geral, Salvador tornou-se um dos principais portos do Atlântico Sul, ligado ao ciclo açucareiro e a um intenso comércio de pessoas escravizadas vindas majoritariamente da Costa da Mina e de Angola. A cidade preserva hoje uma das culturas afro-atlânticas mais vivas do mundo, do Candomblé à capoeira.',
    cover_image: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Salvador_no_s%C3%A9culo_XVIII.jpg',
    gallery: ['https://upload.wikimedia.org/wikipedia/commons/2/29/Salvador_no_s%C3%A9culo_XVIII.jpg'],
    documents: [
      { title: 'Ficha Histórica: Porto de Salvador', type: 'pdf', url: '/documents/porto-de-salvador.pdf' },
      { title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' },
    ],
    coordinates: [-38.5124, -12.9714],
  },
  {
    id: 'cais-valongo',
    title: 'Cais do Valongo',
    subtitle: 'Rio de Janeiro, Brasil',
    category_id: 'portos',
    period: '1811 – 1831',
    country: 'Brasil',
    description:
      'Construído em 1811 para o desembarque de africanos escravizados, o Cais do Valongo tornou-se o maior porto de entrada de pessoas escravizadas de toda a história do Atlântico. Redescoberto em 2011, é reconhecido pela UNESCO como Patrimônio Mundial (2017) e símbolo da memória da escravidão e da resistência negra no Brasil.',
    cover_image: wm('Cais_do_Valongo_e_da_Imperatriz.jpg'),
    gallery: [wm('Cais_do_Valongo_e_da_Imperatriz.jpg')],
    documents: [
      { title: 'Ficha Histórica: Cais do Valongo', type: 'pdf', url: '/documents/cais-do-valongo.pdf' },
    ],
    coordinates: [-43.187389, -22.897111],
  },
  {
    id: 'porto-recife',
    title: 'Porto do Recife',
    subtitle: 'Pernambuco, Brasil',
    category_id: 'portos',
    period: 'Século XVI – XIX',
    country: 'Brasil',
    description:
      'Um dos mais ricos portos do mundo durante a ocupação neerlandesa (Nova Holanda, 1630–1654), Recife foi centro do ciclo açucareiro e ponto de conexão direta com o comércio holandês na Costa do Ouro africana, incluindo o Castelo de Elmina.',
    cover_image: null,
    gallery: [],
    documents: [
      { title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' },
    ],
    coordinates: [-34.8770, -8.0476],
  },
  {
    id: 'porto-lisboa',
    title: 'Porto de Lisboa',
    subtitle: 'Portugal',
    category_id: 'portos',
    period: 'Século XV – XIX',
    country: 'Portugal',
    description:
      'Centro nervoso do Império Ultramarino português. Do Cais da Ribeira partiram as frotas que estabeleceram as primeiras conexões mercantis entre Europa, África e as Américas, dando origem às rotas atlânticas que décadas depois seriam dominadas pelo tráfico de pessoas escravizadas.',
    cover_image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Lisbon_16th_century.jpg',
    gallery: ['https://upload.wikimedia.org/wikipedia/commons/e/eb/Lisbon_16th_century.jpg'],
    documents: [
      { title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' },
    ],
    coordinates: [-9.1393, 38.7223],
  },
  {
    id: 'porto-luanda',
    title: 'Porto de Luanda',
    subtitle: 'Angola',
    category_id: 'portos',
    period: 'Século XVI – XIX',
    country: 'Angola',
    description:
      'Principal porto de embarque forçado de todo o comércio atlântico. Luanda e a região Centro-Ocidental africana foram, ao longo de mais de três séculos, a origem do maior contingente de pessoas escravizadas enviadas às Américas — sobretudo ao Rio de Janeiro, via Cais do Valongo.',
    cover_image: null,
    gallery: [],
    documents: [
      { title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' },
    ],
    coordinates: [13.2343, -8.8390],
  },
  {
    id: 'elmina',
    title: 'Castelo de São Jorge da Mina (Elmina)',
    subtitle: 'Gana, África Ocidental',
    category_id: 'fortificacoes',
    period: '1482 – Século XIX',
    country: 'Gana',
    description:
      'Erguido em 1482 pela Coroa Portuguesa, foi a primeira grande fortificação europeia na África Subsaariana. Voltado inicialmente ao comércio de ouro, tornou-se um dos principais entrepostos do tráfico transatlântico sob controle português e, depois, neerlandês, com masmorras onde milhares de africanos eram mantidos antes do embarque forçado.',
    cover_image: wm('Elmina_Castle_-_Ghana.jpg'),
    gallery: [wm('Elmina_Castle_-_Ghana.jpg')],
    documents: [
      { title: 'Ficha Histórica: Castelo de Elmina', type: 'pdf', url: '/documents/castelo-de-elmina.pdf' },
    ],
    coordinates: [-1.3486, 5.0836],
  },
  {
    id: 'goreia',
    title: 'Ilha de Gorée',
    subtitle: 'Senegal',
    category_id: 'fortificacoes',
    period: 'Século XV – XIX',
    country: 'Senegal',
    description:
      'Símbolo mundial da memória do tráfico transatlântico, conhecida pela "Casa dos Escravos" e sua "Porta do Não Retorno". Historiadores divergem quanto ao volume real de pessoas embarcadas diretamente pela ilha — seu papel é reconhecido sobretudo por seu valor simbólico e memorial, consolidado pela UNESCO (Patrimônio Mundial desde 1978).',
    cover_image: wm('Goree_Island_-_Inside_inslaved_African_dungeon.jpg'),
    gallery: [wm('Goree_Island_-_Inside_inslaved_African_dungeon.jpg')],
    documents: [
      { title: 'Ficha Histórica: Ilha de Gorée', type: 'pdf', url: '/documents/ilha-de-goreia.pdf' },
    ],
    coordinates: [-17.39722, 14.66778],
  },
  {
    id: 'ouidah',
    title: 'Uidá (Ouidah)',
    subtitle: 'Benim, Golfo do Benim',
    category_id: 'fortificacoes',
    period: 'Século XVII – XIX',
    country: 'Benim',
    culture: 'Reino do Daomé',
    description:
      'Um dos mais ativos portos de embarque forçado do Golfo do Benim, ligado por séculos de comércio direto à Bahia. A cidade preserva a "Rota dos Escravos", trajeto simbólico que liga a antiga praça de leilões ao mar, culminando na "Porta do Não Retorno" — parte de um projeto memorial da UNESCO iniciado em 1994.',
    cover_image: wm('Porte_du_non-retour_au_Benin.jpg'),
    gallery: [wm('Porte_du_non-retour_au_Benin.jpg')],
    documents: [
      { title: 'Ficha Histórica: Uidá (Ouidah)', type: 'pdf', url: '/documents/ouidah.pdf' },
    ],
    coordinates: [2.0878, 6.3222],
  },
  {
    id: 'palmares',
    title: 'Quilombo dos Palmares',
    subtitle: 'Serra da Barriga, Alagoas, Brasil',
    category_id: 'quilombos',
    period: 'c. 1597 – 1694',
    country: 'Brasil',
    culture: 'Confederação de mocambos afro-brasileiros',
    description:
      'A maior e mais duradoura confederação de comunidades formadas por africanos e afrodescendentes fugidos da escravidão nas Américas. Sob lideranças como Ganga Zumba e Zumbi, resistiu por quase um século a expedições luso-brasileiras e neerlandesas, sendo destruída em 1694. Zumbi, morto em 20 de novembro de 1695, tornou-se símbolo maior da resistência negra no Brasil — data que hoje marca o Dia Nacional de Zumbi e da Consciência Negra.',
    cover_image: wm('Est%C3%A1tua_de_Zumbi_dos_Palmares.jpg'),
    gallery: [wm('Est%C3%A1tua_de_Zumbi_dos_Palmares.jpg')],
    documents: [
      { title: 'Ficha Histórica: Quilombo dos Palmares', type: 'pdf', url: '/documents/quilombo-dos-palmares.pdf' },
    ],
    coordinates: [-36.08806, -9.17000],
  },
];

export async function GET() {
  const geojson = {
    type: 'FeatureCollection',
    features: FEATURES.map((f) => ({
      type: 'Feature',
      properties: {
        id: f.id,
        title: f.title,
        subtitle: f.subtitle,
        category_id: f.category_id,
        period: f.period,
        country: f.country,
        culture: (f as any).culture ?? null,
        description: f.description,
        cover_image: f.cover_image,
        gallery: f.gallery,
        documents: f.documents,
      },
      geometry: { type: 'Point', coordinates: f.coordinates },
    })),
  };

  return NextResponse.json(geojson);
}
