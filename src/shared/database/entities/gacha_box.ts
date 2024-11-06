import { GachaBoxType } from '../../constants/gacha-box';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GachaBoxPlayer } from './gacha_box_player';

@Entity('gacha_boxes')
export class GachaBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', default: GachaBoxType.COMMON })
  type: GachaBoxType;

  @OneToMany(() => GachaBoxPlayer, (gachaBoxPlayer) => gachaBoxPlayer.gachaBox)
  gachaBoxPlayers: GachaBoxPlayer[];

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
