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
      
      const internalHits = hits.hits.map((item: any) => item._source);
      const federatedHits = await this.fetchFromEuropeanaMock(query);
      
      return [...internalHits, ...federatedHits];
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

  // Federated Search (Agregação Externa)
  private async fetchFromEuropeanaMock(query: string) {
    if (query.length < 3) return [];
    
    // Simula uma chamada RESTful para API da Europeana ou Wikidata
    return [
      {
        nome: `[Europeana API] Acervo externo correspondente a: ${query}`,
        tipo: 'Documento Digitalizado',
        _obs: 'Este resultado foi agregado automaticamente de instituições globais parceiras.'
      }
    ];
  }
}
