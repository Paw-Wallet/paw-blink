import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Mission } from './mission';
import { Player } from './player';

export enum PlayerMissionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CLAIMED = 'claimed',
}

@Entity('player_missions')
export class PlayerMission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_id', nullable: false })
  playerId: string;

  @Column({ name: 'mission_id', nullable: false })
  missionId: number;

  @Column({
    type: 'enum',
    enum: PlayerMissionStatus,
    default: PlayerMissionStatus.IN_PROGRESS,
  })
  status: PlayerMissionStatus;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @Column({ name: 'claimed_at', nullable: true })
  claimedAt: Date;
}
