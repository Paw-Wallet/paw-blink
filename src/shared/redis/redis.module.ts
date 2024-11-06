import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import configuration from '../configs/configuration';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: configuration().redis.host,
          port: configuration().redis.port,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
