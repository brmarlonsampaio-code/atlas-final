import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminService } from './admin.service';
import type { CreateEntityInput } from './admin.service';

@ApiTags('backoffice')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('entities')
  @ApiOperation({ summary: 'Lista todas as entidades cadastradas (visão administrativa)' })
  listEntities() {
    return this.adminService.listEntities();
  }

  @Post('entities')
  @ApiOperation({ summary: 'Cria uma nova entidade (documento/local) no banco' })
  createEntity(@Body() body: CreateEntityInput) {
    return this.adminService.createEntity(body);
  }

  @Put('entities/:id')
  @ApiOperation({ summary: 'Edita uma entidade existente' })
  updateEntity(@Param('id') id: string, @Body() body: Partial<CreateEntityInput>) {
    return this.adminService.updateEntity(id, body);
  }

  @Delete('entities/:id')
  @ApiOperation({ summary: 'Remove uma entidade e seus vínculos' })
  deleteEntity(@Param('id') id: string) {
    return this.adminService.deleteEntity(id);
  }

  @Post('entities/:id/documents')
  @ApiOperation({ summary: 'Anexa um documento (PDF/imagem) a uma entidade' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  attachDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
  ) {
    return this.adminService.attachDocument(id, file, title);
  }

  @Post('upload-geojson')
  @ApiOperation({ summary: 'Importa em massa um FeatureCollection GeoJSON de pontos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadGeoJSON(@UploadedFile() file: Express.Multer.File) {
    return this.adminService.importGeoJSON(file);
  }
}
