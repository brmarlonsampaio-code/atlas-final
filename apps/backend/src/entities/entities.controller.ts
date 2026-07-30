import { Controller, Get, Param } from '@nestjs/common';
import { EntitiesService } from './entities.service';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  async getAllAsGeoJSON() {
    return this.entitiesService.getAllAsGeoJSON();
  }

  @Get(':id')
  async getOneDetailed(@Param('id') id: string) {
    return this.entitiesService.getOneDetailed(id);
  }
}
