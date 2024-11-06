import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('external_purchased_items')
export class ExternalPurchasedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column({ name: 'wallet_address' })
  walletAddress: string;

  @Column({ name: 'claimed' })
  claimed: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'claimed_at' })
  claimedAt: Date;

  @Column({ name: 'game_tx_id' })
  gameTxId: number;
}
