import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'price', type: 'double precision' })
  price: number;

  @Column({ name: 'type', type: 'varchar' })
  type: string;

  @Column({ name: 'reward', type: 'double precision' })
  reward: number;
}
