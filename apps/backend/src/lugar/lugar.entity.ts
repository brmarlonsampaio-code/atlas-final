import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lugares')
export class Lugar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  coordenadas: string;

  @Column({ type: 'jsonb', nullable: true })
  dados_historicos: any;
}
