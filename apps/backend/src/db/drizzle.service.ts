import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  public db: NodePgDatabase<typeof schema>;
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:L%40mina50%2378@db.lxzfedugdsonymqavhlt.supabase.co:5432/postgres',
    });
    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
