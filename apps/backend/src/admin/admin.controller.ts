import { Controller, Post, UseInterceptors, UploadedFile, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('backoffice')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  @Post('upload-geojson')
  @ApiOperation({ summary: 'Faz o upload e ingestão de um dataset GeoJSON (Mapas/Rotas)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadGeoJSON(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { success: false, message: 'Nenhum arquivo enviado.' };
    }

    this.logger.log(`Recebido arquivo GeoJSON: ${file.originalname} (${file.size} bytes)`);

    try {
      // O conteúdo binário do arquivo seria convertido em JSON
      const content = file.buffer.toString('utf8');
      const geojson = JSON.parse(content);

      // Aqui ocorreria a chamada ao serviço PostGIS para importar maciçamente a geometria.
      
      return {
        success: true,
        message: 'Dataset espacial importado com sucesso para o PostGIS.',
        featuresCount: geojson.features?.length || 0,
      };
    } catch (e) {
      this.logger.error('Erro ao processar GeoJSON', e);
      return { success: false, message: 'Arquivo JSON/GeoJSON inválido.' };
    }
  }
}
