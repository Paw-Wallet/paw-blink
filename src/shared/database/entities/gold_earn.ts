import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gold_earn')
export class GoldEarn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'season_id' })
  seasonId: number;
}
