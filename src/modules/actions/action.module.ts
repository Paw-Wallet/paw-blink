import { BlinkWhitelist } from '@/shared/database/entities/blink_whitelist';
import { ExternalPurchasedItem } from '@/shared/database/entities/external_purchased_item';
import { GameTransaction } from '@/shared/database/entities/game_transaction';
import { Item } from '@/shared/database/entities/item';
import { Player } from '@/shared/database/entities/player';
import { GoldEarnRepository } from '@/shared/database/repositories/gold-earn.repository';
import { GoldHistoryRepository } from '@/shared/database/repositories/gold-history.repository';
import { SeasonRepository } from '@/shared/database/repositories/season.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractModule } from '../contract/contract.module';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';

@Module({
  controllers: [ActionController],
  providers: [ActionService, GoldEarnRepository, GoldHistoryRepository, SeasonRepository],
  imports: [
    TypeOrmModule.forFeature([Player, BlinkWhitelist, Item, ExternalPurchasedItem, GameTransaction]),
    ContractModule,
  ],
})
export class ActionModule {}
