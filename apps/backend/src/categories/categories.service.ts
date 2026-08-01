import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../db/drizzle.service';
import { categories } from '../db/schema';

@Injectable()
export class CategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async listAll() {
    return this.drizzleService.db.select().from(categories);
  }
}
