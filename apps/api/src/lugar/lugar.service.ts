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
  async getMockPortos() {
    return {
      type: "FeatureCollection",
      features: [
        { type: "Feature", geometry: { type: "Point", coordinates: [-38.51, -12.97] }, properties: { nome: "Porto de Salvador", tipo: "Américas", periodo: "Séc XVI - XIX" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [-43.20, -22.90] }, properties: { nome: "Cais do Valongo", tipo: "Américas", periodo: "Séc XVIII - XIX" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [-34.88, -8.05] }, properties: { nome: "Porto do Recife", tipo: "Américas", periodo: "Séc XVI - XIX" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [13.23, -8.83] }, properties: { nome: "Porto de Luanda", tipo: "África", periodo: "Séc XVI - XIX" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [2.33, 6.36] }, properties: { nome: "Ouidah", tipo: "África", periodo: "Séc XVII - XIX" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [-9.13, 38.72] }, properties: { nome: "Lisboa", tipo: "Europa", periodo: "Séc XV - XIX" } }
      ]
    };
  }

  async getMockRotas() {
    return [
      { origem: "Luanda", destino: "Salvador", from: [13.23, -8.83], to: [-38.51, -12.97], volume: 500000 },
      { origem: "Ouidah", destino: "Valongo", from: [2.33, 6.36], to: [-43.20, -22.90], volume: 800000 },
      { origem: "Lisboa", destino: "Salvador", from: [-9.13, 38.72], to: [-38.51, -12.97], volume: 150000 },
      { origem: "Lisboa", destino: "Recife", from: [-9.13, 38.72], to: [-34.88, -8.05], volume: 100000 }
    ];
  }
}
