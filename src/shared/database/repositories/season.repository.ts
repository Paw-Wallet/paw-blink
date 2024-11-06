import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { DataSource, Repository } from 'typeorm';
import { Season } from '../entities/season';

@Injectable()
export class SeasonRepository extends Repository<Season> {
  constructor(
    private dataSource: DataSource,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    super(Season, dataSource.createEntityManager());
  }

  async getCurrentSeasonId() {
    const currentSeasonId = await this.redis.get('currentSeasonId');
    return parseInt(currentSeasonId) || 0;
  }
}
