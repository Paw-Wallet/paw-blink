import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player';
import { GachaBox } from './gacha_box';

@Entity('gacha_box_players')
export class GachaBoxPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.gachaBoxPlayers)
  player: string;

  @ManyToOne(() => GachaBox, (gachaBox) => gachaBox.gachaBoxPlayers)
  gachaBox: number;

  @Column({ name: 'is_opened', default: false })
  isOpened: boolean;

  @Column({ name: 'available_at', type: 'timestamptz' })
  availableAt: Date;

  @Column({ name: 'opened_at', type: 'timestamptz' })
  openedAt: Date;

  @Column({ name: 'value', nullable: true })
  value!: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
