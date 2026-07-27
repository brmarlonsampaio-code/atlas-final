import { Injectable, Logger } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  /**
   * Processa uma imagem de manuscrito, extraindo texto via OCR
   * e simulando a extração de metadados via pipeline NLP (Named Entity Recognition).
   */
  async processDocument(imageUrl: string) {
    this.logger.log(`Iniciando OCR para documento: ${imageUrl}`);
    
    try {
      // 1. OCR (Reconhecimento Óptico de Caracteres)
      const { data: { text } } = await Tesseract.recognize(
        imageUrl,
        'por', // Português
        { logger: m => this.logger.debug(`Status OCR: ${m.status}`) }
      );

      // 2. Extração de Entidades Nomeadas (Mock de IA Generativa)
      const entities = this.extractEntitiesMock(text);

      return {
        success: true,
        transcription: text,
        metadata: {
          keywords: entities.keywords,
          dates: entities.dates,
          locations: entities.locations,
        }
      };
    } catch (error) {
      this.logger.error('Falha no processamento de OCR', error);
      throw new Error('Falha no pipeline de Inteligência Artificial');
    }
  }

  private extractEntitiesMock(text: string) {
    // Analisador básico (stub para futura integração com LangChain/OpenAI)
    const locations = [];
    if (text.toLowerCase().includes('rio')) locations.push('Rio de Janeiro');
    if (text.toLowerCase().includes('bahia')) locations.push('Bahia');
    if (text.toLowerCase().includes('lisboa')) locations.push('Lisboa');
    
    return {
      keywords: ['Manuscrito', 'Colônia', 'História Digital', 'Acervo'],
      dates: ['Século XVIII'],
      locations: locations.length > 0 ? locations : ['Local Não Identificado']
    };
  }
}
