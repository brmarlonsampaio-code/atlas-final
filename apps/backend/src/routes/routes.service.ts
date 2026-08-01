import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../db/drizzle.service';
import { sql } from 'drizzle-orm';

@Injectable()
export class RoutesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  /**
   * Retorna as rotas atlânticas como GeoJSON FeatureCollection.
   * `intensity` é um valor relativo (1-5) usado só para espessura visual da linha,
   * não representa contagem exata de pessoas/viagens — ver nota no seed.
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
          'geometry', ST_AsGeoJSON(r.geom)::json,
          'properties', json_build_object(
            'id', r.id,
            'origem', origin.title,
            'destino', dest.title,
            'category', r.category,
            'intensity', r.intensity,
            'note', r.note
          )
        ) as feature
        FROM routes r
        JOIN entities origin ON origin.id = r.source_entity_id
        JOIN entities dest ON dest.id = r.target_entity_id
      ) as t;
    `);

    return (result.rows[0] as any).geojson;
  }
}
