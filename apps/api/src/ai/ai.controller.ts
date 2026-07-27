import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('Inteligência Artificial')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('process-document')
  @ApiOperation({ summary: 'Submete uma imagem de documento para extração de OCR e Metadados via IA' })
  @ApiBody({ schema: { example: { imageUrl: 'https://exemplo.com/manuscrito.jpg' } } })
  async processDocument(@Body('imageUrl') imageUrl: string) {
    if (!imageUrl) {
      return { success: false, message: 'imageUrl é obrigatório' };
    }
    return this.aiService.processDocument(imageUrl);
  }
}
