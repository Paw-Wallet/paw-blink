import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blink_whitelist')
export class BlinkWhitelist {
  @PrimaryColumn({ name: 'wallet_address' })
  walletAddress: string;

  @Column({ name: 'tx_id' })
  txId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'claimed' })
  claimed: boolean;

  @Column({ name: 'reward' })
  reward: number;
}
