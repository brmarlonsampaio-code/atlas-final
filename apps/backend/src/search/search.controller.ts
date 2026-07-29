import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('busca')
@Controller('busca')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Realiza uma busca global aproximada (Fuzzy Search)' })
  @ApiQuery({ name: 'q', required: true, description: 'Termo de busca (ex: Salvador, Escravidão, Algodão)' })
  search(@Query('q') q: string) {
    if (!q) return [];
    return this.searchService.searchFuzzy(q);
  }
}
