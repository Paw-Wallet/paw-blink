import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_code_quests')
export class UserCodeQuest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'quest_id' })
  questId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
