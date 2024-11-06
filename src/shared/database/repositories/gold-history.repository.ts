import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GoldHistory } from '../entities/gold_history';
import { GoldChangeType } from '@/shared/constants/gold-change-type';

@Injectable()
export class GoldHistoryRepository extends Repository<GoldHistory> {
  constructor(private dataSource: DataSource) {
    super(GoldHistory, dataSource.createEntityManager());
  }

  async logGoldChange(
    userId: string,
    amount: number,
    type: GoldChangeType,
    seasonId: number,
    metadata: any = null,
  ) {
    const change = new GoldHistory();
    change.userId = userId;
    change.amount = amount;
    change.type = type;
    change.seasonId = seasonId;
    change.metadata = metadata ? JSON.stringify(metadata) : '{}';
    change.createdAt = new Date(Date.now());
    change.updatedAt = new Date(Date.now());
    await this.save(change);
  }
}
