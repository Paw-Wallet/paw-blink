import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('gold_history')
export class GoldHistory {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'metadata' })
  metadata: string;

  @Column({ name: 'season_id' })
  seasonId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
