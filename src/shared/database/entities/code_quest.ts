import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('code_quests')
export class CodeQuest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'reward' })
  reward: number;

  @Column({ name: 'claim_limit' })
  claimLimit: number;

  @Column({ name: 'total_claimed' })
  totalClaimed: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
