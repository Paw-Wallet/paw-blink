import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum GameTransactionType {
  UPGRADE = 'upgrade',
  BUY_ITEM = 'buy_item',
  EXTERNAL_BUY_ITEM = 'external_buy_item',
}

export enum GameTransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity('game_transactions')
export class GameTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tx_id', nullable: true })
  txId: string;

  @Column({
    type: 'enum',
    enum: GameTransactionStatus,
    default: GameTransactionStatus.PENDING,
  })
  status: GameTransactionStatus;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'wallet_address', nullable: true })
  walletAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: GameTransactionType,
    default: GameTransactionType.UPGRADE,
  })
  type: GameTransactionType;

  @Column({ nullable: true })
  metadata: string;
}
