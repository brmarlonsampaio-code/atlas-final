import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LugarService } from './lugar.service';
import { Lugar } from './lugar.entity';

@ApiTags('lugares')
@Controller('lugares')
export class LugarController {
  constructor(private readonly lugarService: LugarService) {}

  @Get('mock/portos')
  @ApiOperation({ summary: 'Retorna GeoJSON de portos simulados' })
  getMockPortos() {
    return this.lugarService.getMockPortos();
  }

  @Get('mock/rotas')
  @ApiOperation({ summary: 'Retorna array JSON de rotas simuladas' })
  getMockRotas() {
    return this.lugarService.getMockRotas();
  }

  @Get()
  @ApiOperation({ summary: 'Busca todos os lugares históricos georreferenciados' })
  @ApiResponse({ status: 200, description: 'Retorna um array de lugares.' })
  findAll(): Promise<Lugar[]> {
    return this.lugarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um lugar pelo seu ID' })
  findOne(@Param('id') id: string): Promise<Lugar | null> {
    return this.lugarService.findOne(id);
  }
}
