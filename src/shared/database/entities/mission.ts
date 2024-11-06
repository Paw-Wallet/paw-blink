import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum MissionType {
  DAILY = 'daily',
  ONE_TIME = 'one_time',
  UNLIMITED = 'unlimited',
  ENTER_CODE = 'enter_code',
}

export enum MissionAction {
  TWITTER_FOLLOW = 'twitter_follow',
  TWITTER_TWEET = 'twitter_tweet',
  TWITTER_LIKE_RETWEET = 'twitter_like_retweet',
  TELEGRAM_JOIN_CHANNEL = 'telegram_join_channel',
  INVITE = 'invite',
  OTHER = 'other',
}

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MissionType,
    default: MissionType.ONE_TIME,
  })
  type: MissionType;

  @Column({
    type: 'enum',
    enum: MissionAction,
    nullable: true,
  })
  action?: MissionAction;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  reward: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'metadata', nullable: true })
  metadata: string;
}
