import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lugar } from './lugar.entity';

@Injectable()
export class LugarService {
  constructor(
    @InjectRepository(Lugar)
    private readonly lugarRepository: Repository<Lugar>,
  ) {}

  findAll(): Promise<Lugar[]> {
    return this.lugarRepository.find();
  }

  findOne(id: string): Promise<Lugar | null> {
    return this.lugarRepository.findOneBy({ id });
  }

  // Retorna o dataset mockado enquanto o banco de dados não está populado
  async getMockData() {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-38.51, -12.97] },
          properties: { nome: "Porto de Salvador", tipo: "Porto", periodo: "Séc XVI - XIX" }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-43.20, -22.90] },
          properties: { nome: "Cais do Valongo", tipo: "Porto", periodo: "Séc XVIII - XIX" }
        }
      ]
    };
  }
}
