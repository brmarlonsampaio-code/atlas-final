import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoutesService } from './routes.service';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna GeoJSON das rotas atlânticas (tráfico, comércio)' })
  getAll() {
    return this.routesService.getAllAsGeoJSON();
  }
}
