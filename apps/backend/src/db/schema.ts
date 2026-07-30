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
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  period: varchar('period'),
  year: varchar('year'),
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
