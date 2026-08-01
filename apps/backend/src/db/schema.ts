import { pgTable, text, timestamp, jsonb, geometry, varchar, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  color: varchar('color').notNull(),
  icon: varchar('icon').notNull(),
  markerStyle: varchar('marker_style').notNull(),
});

export const entities = pgTable('entities', {
  id: varchar('id').primaryKey(),
  title: text('title').notNull(), // Título
  subtitle: text('subtitle'),
  summary: text('summary'), // Resumo
  description: text('description'),
  author: varchar('author'), // Autor
  century: varchar('century'), // Século
  period: varchar('period'), // Período
  year: varchar('year'), // Data
  documentType: varchar('document_type'), // Tipo documental
  theme: varchar('theme'), // Tema
  space: varchar('space'), // Espaço
  process: varchar('process'), // Processo
  object: varchar('object'), // Objeto
  experience: text('experience'), // Experiência
  knowledges: text('knowledges'), // Saberes
  practices: text('practices'), // Fazeres
  country: varchar('country'),
  region: varchar('region'),
  culture: varchar('culture'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  // PostGIS geometry field (Point, LineString, Polygon)
  geom: geometry('geom', { type: 'Geometry', srid: 4326 }).notNull(),
  coverImage: text('cover_image'),
  gallery: jsonb('gallery'),
  videos: jsonb('videos'),
  sourceArchive: text('source_archive'), // Arquivo de origem
  sourceUrl: text('source_url'), // Link da fonte
  bibliography: text('bibliography'), // Bibliografia
  notes: text('notes'), // Observações
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const media = pgTable('media', {
  id: varchar('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  type: varchar('type').notNull(), // 'image', 'video', 'audio', '3d'
});

export const documents = pgTable('documents', {
  id: varchar('id').primaryKey(),
  title: text('title').notNull(),
  type: varchar('type').notNull(), // 'pdf', 'iiif', 'transcription'
  url: text('url').notNull(),
  metadata: jsonb('metadata'),
  referenceAbnt: text('reference_abnt'),
});

export const tags = pgTable('tags', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
});

// N:N Relations
export const entityCategories = pgTable('entity_categories', {
  entityId: varchar('entity_id').references(() => entities.id),
  categoryId: varchar('category_id').references(() => categories.id),
});

export const entityMedia = pgTable('entity_media', {
  entityId: varchar('entity_id').references(() => entities.id),
  mediaId: varchar('media_id').references(() => media.id),
});

export const entityDocuments = pgTable('entity_documents', {
  entityId: varchar('entity_id').references(() => entities.id),
  documentId: varchar('document_id').references(() => documents.id),
});

export const entityTags = pgTable('entity_tags', {
  entityId: varchar('entity_id').references(() => entities.id),
  tagId: varchar('tag_id').references(() => tags.id),
});

export const entityRelations = pgTable('entity_relations', {
  sourceId: varchar('source_id').references(() => entities.id),
  targetId: varchar('target_id').references(() => entities.id),
  relationType: varchar('relation_type'),
});

// Rotas atlânticas (tráfico, comércio) conectando duas entidades já cadastradas.
// A geometria (LineString) é derivada das coordenadas das entidades de origem/destino.
export const routes = pgTable('routes', {
  id: varchar('id').primaryKey(),
  sourceEntityId: varchar('source_entity_id').references(() => entities.id).notNull(),
  targetEntityId: varchar('target_entity_id').references(() => entities.id).notNull(),
  category: varchar('category'), // ex: 'trafico', 'comercio'
  intensity: real('intensity'), // 1-5, uso visual (espessura da linha), não é contagem exata
  note: text('note'),
  geom: geometry('geom', { type: 'LineString', srid: 4326 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
