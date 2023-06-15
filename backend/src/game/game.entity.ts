import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: string;

  @Column()
  contractAddress: string;

  @Column({ default: true })
  isActive: boolean;
}
