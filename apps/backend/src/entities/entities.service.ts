import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../db/drizzle.service';
import { entities } from '../db/schema';
import { sql, eq } from 'drizzle-orm';

@Injectable()
export class EntitiesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAllAsGeoJSON() {
    // Retorna todos os pontos formatados como GeoJSON usando PostGIS nativo
    const result = await this.drizzleService.db.execute(sql`
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(t.*)::json)
      ) as geojson
      FROM (
        SELECT 
          e.id, 
          e.title, 
          e.subtitle,
          e.culture,
          e.geom,
          e.cover_image,
          c.name as category_name,
          c.color,
          c.icon,
          c.marker_style
        FROM entities e
        LEFT JOIN entity_categories ec ON ec.entity_id = e.id
        LEFT JOIN categories c ON c.id = ec.category_id
      ) as t;
    `);

    // Se o banco estiver vazio, result.rows[0].geojson será null
    if (!result.rows[0].geojson) {
        return { type: 'FeatureCollection', features: [] };
    }
    
    return result.rows[0].geojson;
  }

  async getOneDetailed(id: string) {
    // Retorna entidade completa
    const result = await this.drizzleService.db.query.entities.findFirst({
      where: eq(entities.id, id),
    });
    return result;
  }
}
