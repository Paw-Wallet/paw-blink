import { BusinessCode } from '@/shared/constants/business-code';
import { GoldChangeType } from '@/shared/constants/gold-change-type';
import { BlinkWhitelist } from '@/shared/database/entities/blink_whitelist';
import {
  GameTransaction,
  GameTransactionStatus,
  GameTransactionType,
} from '@/shared/database/entities/game_transaction';
import { Item } from '@/shared/database/entities/item';
import { Player } from '@/shared/database/entities/player';
import { GoldEarnRepository } from '@/shared/database/repositories/gold-earn.repository';
import { GoldHistoryRepository } from '@/shared/database/repositories/gold-history.repository';
import { SeasonRepository } from '@/shared/database/repositories/season.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractService } from '../contract/contract.service';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(BlinkWhitelist)
    private readonly blinkWhitelistRepository: Repository<BlinkWhitelist>,
    @InjectRepository(GameTransaction)
    private readonly transactionRepository: Repository<GameTransaction>,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly goldRepository: GoldHistoryRepository,
    private readonly seasonRepository: SeasonRepository,
    private readonly goldEarnRepository: GoldEarnRepository,
  ) {}

  async getAvailableWhitelistItem(userId: string, walletAddress: string) {
    const player = await this.playerRepository.findOne({ where: { userId } });
    if (!player) {
      throw new BadRequestException(BusinessCode.PLAYER_NOT_FOUND);
    }
    const whitelist = await this.blinkWhitelistRepository.findOne({
      where: { walletAddress },
    });
    const claimedWhitelist = await this.goldRepository.findOne({
      where: { userId, type: GoldChangeType.BLINK_REWARD },
    });

    if (
      whitelist &&
      !claimedWhitelist &&
      !whitelist.claimed &&
      player.initializeTime > whitelist.createdAt
    ) {
      return whitelist;
    }
    return null;
  }

  async claimWhiteListReward(userId: string, walletAddress: string) {
    let player = await this.playerRepository.findOne({ where: { userId } });
    if (!player) {
      throw new BadRequestException(BusinessCode.PLAYER_NOT_FOUND);
    }
    const whitelist = await this.getAvailableWhitelistItem(
      userId,
      walletAddress,
    );
    if (!whitelist) {
      throw new BadRequestException(BusinessCode.NO_AVAILABLE_REWARD);
    }
    player.balance += whitelist.reward;
    player = await this.playerRepository.save(player);

    const currentSeasonId = await this.seasonRepository.getCurrentSeasonId();
    await this.goldRepository.logGoldChange(
      player.userId,
      whitelist.reward,
      GoldChangeType.BLINK_REWARD,
      currentSeasonId,
    );
    await this.goldEarnRepository.logGoldEarn(
      player.userId,
      whitelist.reward,
      currentSeasonId,
    );

    whitelist.claimed = true;
    await this.blinkWhitelistRepository.save(whitelist);
    return {
      reward: whitelist.reward,
    };
  }

  @OnEvent('transaction.registerWhitelist')
  async onPayTransaction(data: {
    txId: string;
    status: string;
    account: string;
  }) {
    if (data.status !== 'success') {
      return;
    }
    const whitelist = await this.blinkWhitelistRepository.findOne({
      where: { walletAddress: data.account },
    });
    if (whitelist) {
      return;
    }
    const item = new BlinkWhitelist();
    item.walletAddress = data.account;
    item.txId = data.txId;
    item.claimed = false;
    item.reward = this.configService.get<number>('common.blinkWhiteListReward');
    await this.blinkWhitelistRepository.save(item);
  }

  async createBlinkBuyItemTx(item: Item, walletAddress: string) {
    const discount = this.configService.get<number>(
      'common.blinkStarterBoxDiscount',
    );
    const price = item.price * (1 - discount);
    let gameTransaction = new GameTransaction();
    gameTransaction.walletAddress = walletAddress;
    gameTransaction.type = GameTransactionType.EXTERNAL_BUY_ITEM;
    gameTransaction.status = GameTransactionStatus.PENDING;
    gameTransaction.metadata = JSON.stringify({
      fee: price,
      itemId: item.id,
    });
    gameTransaction = await this.transactionRepository.save(gameTransaction);

    const transaction = await this.contractService.buildPayTx(
      walletAddress,
      price,
      gameTransaction.id,
    );
    return transaction;
  }
}
