import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LugarService } from './lugar.service';
import { Lugar } from './lugar.entity';

@ApiTags('lugares')
@Controller('lugares')
export class LugarController {
  constructor(private readonly lugarService: LugarService) {}

  @Get('mock')
  @ApiOperation({ summary: 'Retorna um GeoJSON mockado para testes do frontend' })
  getMock() {
    return this.lugarService.getMockData();
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
