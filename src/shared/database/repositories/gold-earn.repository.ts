import { DataSource, MoreThan, Repository } from 'typeorm';
import { GoldEarn } from '../entities/gold_earn';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoldEarnRepository extends Repository<GoldEarn> {
  constructor(private dataSource: DataSource) {
    super(GoldEarn, dataSource.createEntityManager());
  }

  async logGoldEarn(userId: string, amount: number, seasonId: number) {
    const item = await this.findOne({ where: { userId, seasonId } });
    if (item) {
      item.amount += amount;
      await this.save(item);
    } else {
      await this.save({ userId, amount, seasonId });
    }
  }

  async getTopGoldEarners(seasonId: number, limit: number) {
    return this.createQueryBuilder('goldEarn')
      .select('goldEarn.userId', 'userId')
      .addSelect('players.username', 'username')
      .addSelect('goldEarn.amount', 'totalGold')
      .innerJoin('players', 'players', 'players.userId = goldEarn.userId')
      .where('goldEarn.seasonId = :seasonId', { seasonId })
      .orderBy('goldEarn.amount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getPosition(userId: string, seasonId: number) {
    const item = await this.findOne({ where: { userId, seasonId } });
    const count = await this.count({ where: { seasonId, amount: MoreThan(item?.amount ?? 0) } });
    return {
      totalGold: item?.amount ?? 0,
      position: count + 1,
    };
  }
}
