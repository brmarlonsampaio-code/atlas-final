import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DrizzleService } from '../db/drizzle.service';
import { entities, categories } from '../db/schema';
import { sql, eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'documents');

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface CreateEntityInput {
  id?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  author?: string;
  century?: string;
  period?: string;
  year?: string;
  documentType?: string;
  theme?: string;
  space?: string;
  process?: string;
  object?: string;
  experience?: string;
  knowledges?: string;
  practices?: string;
  country?: string;
  region?: string;
  culture?: string;
  latitude: number;
  longitude: number;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  coverImage?: string;
  sourceArchive?: string;
  sourceUrl?: string;
  bibliography?: string;
  notes?: string;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly drizzleService: DrizzleService) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  async listEntities() {
    return this.drizzleService.db.execute(sql`
      SELECT e.id, e.title, e.subtitle, e.period, e.country, e.author, c.name as category_name
      FROM entities e
      LEFT JOIN entity_categories ec ON ec.entity_id = e.id
      LEFT JOIN categories c ON c.id = ec.category_id
      ORDER BY e.created_at DESC NULLS LAST;
    `).then((r) => r.rows);
  }

  async createEntity(input: CreateEntityInput) {
    if (!input.title?.trim()) {
      throw new BadRequestException('Campo "title" é obrigatório.');
    }
    if (typeof input.latitude !== 'number' || typeof input.longitude !== 'number') {
      throw new BadRequestException('Campos "latitude" e "longitude" são obrigatórios e devem ser números.');
    }
    if (input.latitude < -90 || input.latitude > 90 || input.longitude < -180 || input.longitude > 180) {
      throw new BadRequestException('Latitude/longitude fora do intervalo válido.');
    }

    const id = input.id?.trim() || slugify(input.title);

    if (input.categoryId) {
      const cat = await this.drizzleService.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.categoryId));
      if (cat.length === 0) {
        await this.drizzleService.db.insert(categories).values({
          id: input.categoryId,
          name: input.categoryName || input.categoryId,
          color: input.categoryColor || '#6B7280',
          icon: input.categoryIcon || '📍',
          markerStyle: 'circle',
        }).onConflictDoNothing();
      }
    }

    await this.drizzleService.db.insert(entities).values({
      id,
      title: input.title,
      subtitle: input.subtitle,
      summary: input.summary,
      description: input.description,
      author: input.author,
      century: input.century,
      period: input.period,
      year: input.year,
      documentType: input.documentType,
      theme: input.theme,
      space: input.space,
      process: input.process,
      object: input.object,
      experience: input.experience,
      knowledges: input.knowledges,
      practices: input.practices,
      country: input.country,
      region: input.region,
      culture: input.culture,
      latitude: input.latitude,
      longitude: input.longitude,
      geom: sql`ST_SetSRID(ST_MakePoint(${input.longitude}, ${input.latitude}), 4326)`,
      coverImage: input.coverImage,
      sourceArchive: input.sourceArchive,
      sourceUrl: input.sourceUrl,
      bibliography: input.bibliography,
      notes: input.notes,
    });

    if (input.categoryId) {
      await this.drizzleService.db.execute(sql`
        INSERT INTO entity_categories (entity_id, category_id) VALUES (${id}, ${input.categoryId})
      `);
    }

    this.logger.log(`Entidade criada: ${id}`);
    return { success: true, id };
  }

  async updateEntity(id: string, input: Partial<CreateEntityInput>) {
    const existing = await this.drizzleService.db.select().from(entities).where(eq(entities.id, id));
    if (existing.length === 0) {
      throw new NotFoundException(`Entidade "${id}" não encontrada.`);
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    const fields: (keyof CreateEntityInput)[] = [
      'title', 'subtitle', 'summary', 'description', 'author', 'century', 'period', 'year',
      'documentType', 'theme', 'space', 'process', 'object', 'experience', 'knowledges',
      'practices', 'country', 'region', 'culture', 'coverImage', 'sourceArchive', 'sourceUrl',
      'bibliography', 'notes',
    ];
    for (const field of fields) {
      if (input[field] !== undefined) updates[field] = input[field];
    }

    if (input.latitude !== undefined || input.longitude !== undefined) {
      const lat = input.latitude ?? existing[0].latitude;
      const lng = input.longitude ?? existing[0].longitude;
      updates.latitude = lat;
      updates.longitude = lng;
      updates.geom = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;
    }

    await this.drizzleService.db.update(entities).set(updates).where(eq(entities.id, id));

    if (input.categoryId) {
      await this.drizzleService.db.execute(sql`
        DELETE FROM entity_categories WHERE entity_id = ${id};
        INSERT INTO entity_categories (entity_id, category_id) VALUES (${id}, ${input.categoryId});
      `);
    }

    return { success: true, id };
  }

  async deleteEntity(id: string) {
    const existing = await this.drizzleService.db.select().from(entities).where(eq(entities.id, id));
    if (existing.length === 0) {
      throw new NotFoundException(`Entidade "${id}" não encontrada.`);
    }

    // Remove vínculos antes da entidade, pra não esbarrar nas FKs.
    await this.drizzleService.db.execute(sql`DELETE FROM entity_categories WHERE entity_id = ${id}`);
    await this.drizzleService.db.execute(sql`DELETE FROM entity_documents WHERE entity_id = ${id}`);
    await this.drizzleService.db.execute(sql`DELETE FROM entity_tags WHERE entity_id = ${id}`);
    await this.drizzleService.db.execute(sql`DELETE FROM entity_media WHERE entity_id = ${id}`);
    await this.drizzleService.db.execute(sql`DELETE FROM routes WHERE source_entity_id = ${id} OR target_entity_id = ${id}`);
    await this.drizzleService.db.delete(entities).where(eq(entities.id, id));

    this.logger.log(`Entidade removida: ${id}`);
    return { success: true, id };
  }

  /**
   * Salva o arquivo em disco (uploads/documents), cria o registro em `documents`
   * e vincula à entidade via `entity_documents`. Uso local/dev — em produção
   * trocar por um storage de verdade (Supabase Storage/S3).
   */
  async attachDocument(entityId: string, file: Express.Multer.File, title?: string) {
    const existing = await this.drizzleService.db.select().from(entities).where(eq(entities.id, entityId));
    if (existing.length === 0) {
      throw new NotFoundException(`Entidade "${entityId}" não encontrada.`);
    }
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const ext = path.extname(file.originalname) || '';
    const safeName = `${slugify(path.basename(file.originalname, ext))}-${Date.now()}${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, safeName), file.buffer);

    const docId = `${entityId}__${safeName}`;
    const type = ext.replace('.', '') || 'file';
    const url = `/uploads/documents/${safeName}`;

    await this.drizzleService.db.execute(sql`
      INSERT INTO documents (id, title, type, url) VALUES (${docId}, ${title || file.originalname}, ${type}, ${url})
    `);
    await this.drizzleService.db.execute(sql`
      INSERT INTO entity_documents (entity_id, document_id) VALUES (${entityId}, ${docId})
    `);

    this.logger.log(`Documento anexado a ${entityId}: ${safeName}`);
    return { success: true, url, documentId: docId };
  }

  /**
   * Importa um FeatureCollection GeoJSON, criando entidades reais no banco.
   * Categoria é criada automaticamente se `properties.category_id` vier
   * preenchido e ainda não existir (com cor/ícone genéricos — ajustável depois).
   */
  async importGeoJSON(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    let geojson: any;
    try {
      geojson = JSON.parse(file.buffer.toString('utf8'));
    } catch {
      throw new BadRequestException('Arquivo não é um JSON válido.');
    }

    if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
      throw new BadRequestException('Esperado um GeoJSON do tipo FeatureCollection com "features".');
    }

    let imported = 0;
    const errors: string[] = [];

    for (const [i, feature] of geojson.features.entries()) {
      try {
        const props = feature.properties || {};
        const geom = feature.geometry;

        if (!props.title) {
          throw new Error('sem "title" em properties');
        }
        if (!geom || geom.type !== 'Point' || !Array.isArray(geom.coordinates)) {
          throw new Error('geometria ausente ou não é um Point — só pontos são suportados na importação em massa por enquanto');
        }

        const id = props.id ? String(props.id) : slugify(props.title) + '-' + (i + 1);
        const [lng, lat] = geom.coordinates;

        if (props.category_id) {
          const cat = await this.drizzleService.db
            .select()
            .from(categories)
            .where(eq(categories.id, props.category_id));
          if (cat.length === 0) {
            await this.drizzleService.db.insert(categories).values({
              id: props.category_id,
              name: props.category_id,
              color: '#6B7280',
              icon: '📍',
              markerStyle: 'circle',
            }).onConflictDoNothing();
          }
        }

        await this.drizzleService.db.insert(entities).values({
          id,
          title: props.title,
          subtitle: props.subtitle,
          description: props.description,
          period: props.period,
          country: props.country,
          culture: props.culture,
          latitude: lat,
          longitude: lng,
          geom: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
          coverImage: props.cover_image,
        }).onConflictDoNothing();

        if (props.category_id) {
          await this.drizzleService.db.execute(sql`
            INSERT INTO entity_categories (entity_id, category_id) VALUES (${id}, ${props.category_id})
            ON CONFLICT DO NOTHING
          `);
        }

        imported++;
      } catch (e: any) {
        errors.push(`Feature ${i}: ${e.message}`);
      }
    }

    this.logger.log(`Importação GeoJSON: ${imported}/${geojson.features.length} entidades importadas.`);
    return {
      success: true,
      featuresCount: geojson.features.length,
      imported,
      errors,
    };
  }
}
