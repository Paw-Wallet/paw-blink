import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GachaBoxPlayer } from './gacha_box_player';

@Entity('players')
export class Player {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'level', default: 0 })
  level: number;

  @Column({ name: 'hearts', default: 3 })
  hearts: number;

  @Column({ name: 'initialize_time', type: 'timestamp' })
  initializeTime: Date;

  @Column({ name: 'last_claim_time', type: 'timestamp' })
  lastClaimTime: Date;

  @Column({ name: 'unclaimed_gold', default: 0 })
  unclaimedGold: number;

  @Column({ name: 'locked_gold', default: 0 })
  lockedGold: number;

  @Column({ name: 'balance', default: 0 })
  balance: number;

  @Column({ name: 'last_session_start_time', type: 'timestamp' })
  lastSessionStartTime: Date;

  @Column({ name: 'last_session_end_time', type: 'timestamp' })
  lastSessionEndTime: Date;

  @Column({ name: 'last_accumulate_time', type: 'timestamp' })
  lastAccumulateTime: Date;

  @Column({ name: 'season_end_time', type: 'timestamp' })
  seasonEndTime: Date;

  @Column({ name: 'upgrade_complete_time', type: 'timestamp' })
  upgradeCompleteTime: Date;

  @OneToMany(() => GachaBoxPlayer, (gachaBoxPlayer) => gachaBoxPlayer.player)
  gachaBoxPlayers: GachaBoxPlayer[];
}
