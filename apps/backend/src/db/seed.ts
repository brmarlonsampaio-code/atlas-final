/**
 * Popula o banco com os dados que hoje vivem hardcoded em
 * apps/web/src/app/api/mock/{portos,rotas}/route.ts — esses arquivos
 * mock serão removidos depois que este seed rodar com sucesso.
 *
 * Uso: DATABASE_URL=postgresql://... npx tsx src/db/seed.ts
 * (ou configure apps/backend/.env e rode: npm run seed)
 */
import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Configure apps/backend/.env (veja .env.example).');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

function wm(file: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;
}

const CATEGORIES = [
  { id: 'portos', name: 'Portos', color: '#2563EB', icon: '⚓', markerStyle: 'circle' },
  { id: 'fortificacoes', name: 'Fortificações', color: '#B91C1C', icon: '🏰', markerStyle: 'circle' },
  { id: 'quilombos', name: 'Comunidades Quilombolas', color: '#92400E', icon: '🛖', markerStyle: 'circle' },
];

const PLACES = [
  {
    id: 'porto-salvador', title: 'Porto de Salvador', subtitle: 'Bahia, Brasil', categoryId: 'portos',
    period: 'Século XVI – XIX', country: 'Brasil',
    description: 'Fundada em 1549 como sede do Governo-Geral, Salvador tornou-se um dos principais portos do Atlântico Sul, ligado ao ciclo açucareiro e a um intenso comércio de pessoas escravizadas vindas majoritariamente da Costa da Mina e de Angola. A cidade preserva hoje uma das culturas afro-atlânticas mais vivas do mundo, do Candomblé à capoeira.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Salvador_no_s%C3%A9culo_XVIII.jpg',
    gallery: ['https://upload.wikimedia.org/wikipedia/commons/2/29/Salvador_no_s%C3%A9culo_XVIII.jpg'],
    documents: [
      { title: 'Ficha Histórica: Porto de Salvador', type: 'pdf', url: '/documents/porto-de-salvador.pdf' },
      { title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' },
    ],
    coordinates: [-38.5124, -12.9714],
  },
  {
    id: 'cais-valongo', title: 'Cais do Valongo', subtitle: 'Rio de Janeiro, Brasil', categoryId: 'portos',
    period: '1811 – 1831', country: 'Brasil',
    description: 'Construído em 1811 para o desembarque de africanos escravizados, o Cais do Valongo tornou-se o maior porto de entrada de pessoas escravizadas de toda a história do Atlântico. Redescoberto em 2011, é reconhecido pela UNESCO como Patrimônio Mundial (2017) e símbolo da memória da escravidão e da resistência negra no Brasil.',
    coverImage: wm('Cais_do_Valongo_e_da_Imperatriz.jpg'),
    gallery: [wm('Cais_do_Valongo_e_da_Imperatriz.jpg')],
    documents: [{ title: 'Ficha Histórica: Cais do Valongo', type: 'pdf', url: '/documents/cais-do-valongo.pdf' }],
    coordinates: [-43.187389, -22.897111],
  },
  {
    id: 'porto-recife', title: 'Porto do Recife', subtitle: 'Pernambuco, Brasil', categoryId: 'portos',
    period: 'Século XVI – XIX', country: 'Brasil',
    description: 'Um dos mais ricos portos do mundo durante a ocupação neerlandesa (Nova Holanda, 1630–1654), Recife foi centro do ciclo açucareiro e ponto de conexão direta com o comércio holandês na Costa do Ouro africana, incluindo o Castelo de Elmina.',
    coverImage: null, gallery: [],
    documents: [{ title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' }],
    coordinates: [-34.8770, -8.0476],
  },
  {
    id: 'porto-lisboa', title: 'Porto de Lisboa', subtitle: 'Portugal', categoryId: 'portos',
    period: 'Século XV – XIX', country: 'Portugal',
    description: 'Centro nervoso do Império Ultramarino português. Do Cais da Ribeira partiram as frotas que estabeleceram as primeiras conexões mercantis entre Europa, África e as Américas, dando origem às rotas atlânticas que décadas depois seriam dominadas pelo tráfico de pessoas escravizadas.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Lisbon_16th_century.jpg',
    gallery: ['https://upload.wikimedia.org/wikipedia/commons/e/eb/Lisbon_16th_century.jpg'],
    documents: [{ title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' }],
    coordinates: [-9.1393, 38.7223],
  },
  {
    id: 'porto-luanda', title: 'Porto de Luanda', subtitle: 'Angola', categoryId: 'portos',
    period: 'Século XVI – XIX', country: 'Angola',
    description: 'Principal porto de embarque forçado de todo o comércio atlântico. Luanda e a região Centro-Ocidental africana foram, ao longo de mais de três séculos, a origem do maior contingente de pessoas escravizadas enviadas às Américas — sobretudo ao Rio de Janeiro, via Cais do Valongo.',
    coverImage: null, gallery: [],
    documents: [{ title: 'Guia Didático: A Diáspora Africana no Atlântico', type: 'pdf', url: '/documents/guia-diaspora-atlantica.pdf' }],
    coordinates: [13.2343, -8.8390],
  },
  {
    id: 'elmina', title: 'Castelo de São Jorge da Mina (Elmina)', subtitle: 'Gana, África Ocidental', categoryId: 'fortificacoes',
    period: '1482 – Século XIX', country: 'Gana',
    description: 'Erguido em 1482 pela Coroa Portuguesa, foi a primeira grande fortificação europeia na África Subsaariana. Voltado inicialmente ao comércio de ouro, tornou-se um dos principais entrepostos do tráfico transatlântico sob controle português e, depois, neerlandês, com masmorras onde milhares de africanos eram mantidos antes do embarque forçado.',
    coverImage: wm('Elmina_Castle_-_Ghana.jpg'), gallery: [wm('Elmina_Castle_-_Ghana.jpg')],
    documents: [{ title: 'Ficha Histórica: Castelo de Elmina', type: 'pdf', url: '/documents/castelo-de-elmina.pdf' }],
    coordinates: [-1.3486, 5.0836],
  },
  {
    id: 'goreia', title: 'Ilha de Gorée', subtitle: 'Senegal', categoryId: 'fortificacoes',
    period: 'Século XV – XIX', country: 'Senegal',
    description: 'Símbolo mundial da memória do tráfico transatlântico, conhecida pela "Casa dos Escravos" e sua "Porta do Não Retorno". Historiadores divergem quanto ao volume real de pessoas embarcadas diretamente pela ilha — seu papel é reconhecido sobretudo por seu valor simbólico e memorial, consolidado pela UNESCO (Patrimônio Mundial desde 1978).',
    coverImage: wm('Goree_Island_-_Inside_inslaved_African_dungeon.jpg'), gallery: [wm('Goree_Island_-_Inside_inslaved_African_dungeon.jpg')],
    documents: [{ title: 'Ficha Histórica: Ilha de Gorée', type: 'pdf', url: '/documents/ilha-de-goreia.pdf' }],
    coordinates: [-17.39722, 14.66778],
  },
  {
    id: 'ouidah', title: 'Uidá (Ouidah)', subtitle: 'Benim, Golfo do Benim', categoryId: 'fortificacoes',
    period: 'Século XVII – XIX', country: 'Benim', culture: 'Reino do Daomé',
    description: 'Um dos mais ativos portos de embarque forçado do Golfo do Benim, ligado por séculos de comércio direto à Bahia. A cidade preserva a "Rota dos Escravos", trajeto simbólico que liga a antiga praça de leilões ao mar, culminando na "Porta do Não Retorno" — parte de um projeto memorial da UNESCO iniciado em 1994.',
    coverImage: wm('Porte_du_non-retour_au_Benin.jpg'), gallery: [wm('Porte_du_non-retour_au_Benin.jpg')],
    documents: [{ title: 'Ficha Histórica: Uidá (Ouidah)', type: 'pdf', url: '/documents/ouidah.pdf' }],
    coordinates: [2.0878, 6.3222],
  },
  {
    id: 'palmares', title: 'Quilombo dos Palmares', subtitle: 'Serra da Barriga, Alagoas, Brasil', categoryId: 'quilombos',
    period: 'c. 1597 – 1694', country: 'Brasil', culture: 'Confederação de mocambos afro-brasileiros',
    description: 'A maior e mais duradoura confederação de comunidades formadas por africanos e afrodescendentes fugidos da escravidão nas Américas. Sob lideranças como Ganga Zumba e Zumbi, resistiu por quase um século a expedições luso-brasileiras e neerlandesas, sendo destruída em 1694. Zumbi, morto em 20 de novembro de 1695, tornou-se símbolo maior da resistência negra no Brasil — data que hoje marca o Dia Nacional de Zumbi e da Consciência Negra.',
    coverImage: wm('Est%C3%A1tua_de_Zumbi_dos_Palmares.jpg'), gallery: [wm('Est%C3%A1tua_de_Zumbi_dos_Palmares.jpg')],
    documents: [{ title: 'Ficha Histórica: Quilombo dos Palmares', type: 'pdf', url: '/documents/quilombo-dos-palmares.pdf' }],
    coordinates: [-36.08806, -9.17000],
  },
];

// note em cada rota: valor RELATIVO (1-5) só pra espessura visual da linha,
// não é contagem exata de pessoas/viagens — ver slavevoyages.org para dados quantitativos rigorosos.
const ROUTES = [
  { id: 'uida-salvador', from: 'ouidah', to: 'porto-salvador', category: 'trafico', intensity: 5, note: 'Uma das rotas mais intensas e duradouras do tráfico transatlântico, ligando a Costa da Mina/Golfo do Benim à Bahia por mais de dois séculos.' },
  { id: 'luanda-valongo', from: 'porto-luanda', to: 'cais-valongo', category: 'trafico', intensity: 5, note: 'Principal corredor do tráfico transatlântico: a rota entre Angola e o Rio de Janeiro concentrou o maior volume de pessoas escravizadas desembarcadas nas Américas.' },
  { id: 'luanda-salvador', from: 'porto-luanda', to: 'porto-salvador', category: 'trafico', intensity: 3, note: 'Rota secundária, mas relevante, entre a África Centro-Ocidental e a Bahia.' },
  { id: 'elmina-recife', from: 'elmina', to: 'porto-recife', category: 'comercio', intensity: 2, note: 'Rota ativa durante o período do Brasil Neerlandês (1630–1654), quando a Companhia das Índias Ocidentais controlava tanto Elmina quanto Pernambuco.' },
  { id: 'lisboa-salvador', from: 'porto-lisboa', to: 'porto-salvador', category: 'comercio', intensity: 2, note: 'Rota administrativa e comercial metropolitana, ligada ao comércio de açúcar e a outras mercadorias coloniais.' },
  { id: 'lisboa-recife', from: 'porto-lisboa', to: 'porto-recife', category: 'comercio', intensity: 1, note: 'Rota comercial metropolitana ligada ao ciclo açucareiro pernambucano.' },
];

async function seed() {
  console.log('Seed: iniciando...');

  for (const cat of CATEGORIES) {
    await db.insert(schema.categories).values(cat).onConflictDoNothing();
  }
  console.log(`Seed: ${CATEGORIES.length} categorias ok.`);

  for (const place of PLACES) {
    const [lng, lat] = place.coordinates;
    await db.insert(schema.entities).values({
      id: place.id,
      title: place.title,
      subtitle: place.subtitle,
      description: place.description,
      period: place.period,
      country: place.country,
      culture: (place as any).culture ?? null,
      latitude: lat,
      longitude: lng,
      geom: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
      coverImage: place.coverImage,
      gallery: place.gallery,
    }).onConflictDoNothing();

    await db.insert(schema.entityCategories).values({
      entityId: place.id,
      categoryId: place.categoryId,
    }).onConflictDoNothing();

    for (const doc of place.documents) {
      const docId = `${place.id}__${doc.url}`;
      await db.insert(schema.documents).values({
        id: docId,
        title: doc.title,
        type: doc.type,
        url: doc.url,
      }).onConflictDoNothing();

      await db.insert(schema.entityDocuments).values({
        entityId: place.id,
        documentId: docId,
      }).onConflictDoNothing();
    }
  }
  console.log(`Seed: ${PLACES.length} entidades + documentos ok.`);

  for (const route of ROUTES) {
    await db.insert(schema.routes).values({
      id: route.id,
      sourceEntityId: route.from,
      targetEntityId: route.to,
      category: route.category,
      intensity: route.intensity,
      note: route.note,
      geom: sql`(
        SELECT ST_MakeLine(a.geom, b.geom)
        FROM entities a, entities b
        WHERE a.id = ${route.from} AND b.id = ${route.to}
      )`,
    }).onConflictDoNothing();
  }
  console.log(`Seed: ${ROUTES.length} rotas ok.`);

  console.log('Seed: concluído.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed falhou:', err);
  process.exit(1);
});
