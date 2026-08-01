import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../db/drizzle.service';
import { entities } from '../db/schema';
import { sql, eq } from 'drizzle-orm';

@Injectable()
export class EntitiesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  /**
   * Retorna todas as entidades como GeoJSON FeatureCollection, já com
   * categoria (cor/ícone) e documentos vinculados agregados por entidade.
   * Formato compatível com o que o Map.tsx do frontend espera.
   */
  async getAllAsGeoJSON() {
    const result = await this.drizzleService.db.execute(sql`
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(json_agg(feature), '[]'::json)
      ) as geojson
      FROM (
        SELECT json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(e.geom)::json,
          'properties', json_build_object(
            'id', e.id,
            'title', e.title,
            'subtitle', e.subtitle,
            'category_id', c.id,
            'period', e.period,
            'century', e.century,
            'country', e.country,
            'region', e.region,
            'culture', e.culture,
            'description', COALESCE(e.description, e.summary),
            'cover_image', e.cover_image,
            'gallery', COALESCE(e.gallery, '[]'::jsonb),
            'documents', COALESCE(docs.documents, '[]'::json)
          )
        ) as feature
        FROM entities e
        LEFT JOIN entity_categories ec ON ec.entity_id = e.id
        LEFT JOIN categories c ON c.id = ec.category_id
        LEFT JOIN LATERAL (
          SELECT json_agg(json_build_object(
            'title', d.title,
            'type', d.type,
            'url', d.url
          )) as documents
          FROM entity_documents ed
          JOIN documents d ON d.id = ed.document_id
          WHERE ed.entity_id = e.id
        ) docs ON true
      ) as t;
    `);

    return (result.rows[0] as any).geojson;
  }

  /**
   * Retorna uma entidade com todos os metadados (usado no painel de detalhes),
   * incluindo tags e documentos vinculados.
   */
  async getOneDetailed(id: string) {
    const entity = await this.drizzleService.db.query.entities.findFirst({
      where: eq(entities.id, id),
    });
    if (!entity) return null;

    const [tagsResult, docsResult] = await Promise.all([
      this.drizzleService.db.execute(sql`
        SELECT t.id, t.name FROM entity_tags et
        JOIN tags t ON t.id = et.tag_id
        WHERE et.entity_id = ${id}
      `),
      this.drizzleService.db.execute(sql`
        SELECT d.id, d.title, d.type, d.url, d.reference_abnt
        FROM entity_documents ed
        JOIN documents d ON d.id = ed.document_id
        WHERE ed.entity_id = ${id}
      `),
    ]);

    return {
      ...entity,
      tags: tagsResult.rows,
      documents: docsResult.rows,
    };
  }
}
