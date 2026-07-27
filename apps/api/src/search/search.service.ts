import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexData(index: string, document: any) {
    return this.elasticsearchService.index({
      index,
      document,
    });
  }

  async searchFuzzy(query: string) {
    try {
      const { hits } = await this.elasticsearchService.search({
        index: 'lugares_historicos',
        query: {
          multi_match: {
            query,
            fields: ['nome^3', 'dados_historicos.resumo', 'dados_historicos.tags'],
            fuzziness: 'AUTO',
          },
        },
      });
      return hits.hits.map((item) => item._source);
    } catch (e) {
      // Fallback para ambiente local sem ElasticSearch rodando
      return [
        {
          nome: "Resultado Simulado: " + query,
          tipo: "Lugar Histórico",
          _obs: "Conecte o serviço do ElasticSearch para habilitar a busca difusa (Fuzzy Search) em tempo real."
        }
      ];
    }
  }
}
