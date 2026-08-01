import {
  BadRequestException,
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
import { Throttle } from '@nestjs/throttler';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminService } from './admin.service';
import type { CreateEntityInput } from './admin.service';

const ALLOWED_DOCUMENT_TYPES = /\.(pdf|jpg|jpeg|png|webp|gif)$/i;
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_GEOJSON_SIZE = 10 * 1024 * 1024; // 10MB

// Limite bem mais apertado que o resto da API pública: dificulta
// tentar adivinhar ADMIN_API_KEY por força bruta.
@Throttle({ default: { limit: 20, ttl: 60_000 } })
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
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_DOCUMENT_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_DOCUMENT_TYPES.test(file.originalname)) {
          return cb(new BadRequestException('Tipo de arquivo não permitido. Use PDF ou imagem (jpg, png, webp, gif).'), false);
        }
        cb(null, true);
      },
    }),
  )
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
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_GEOJSON_SIZE } }))
  uploadGeoJSON(@UploadedFile() file: Express.Multer.File) {
    return this.adminService.importGeoJSON(file);
  }
}
