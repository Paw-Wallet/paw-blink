import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  Options,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ActionGetResponse, ActionPostResponse } from '@solana/actions';
import { Request, Response } from 'express';
import { ContractService } from '../contract/contract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BlinkWhitelist } from '@/shared/database/entities/blink_whitelist';
import { Repository } from 'typeorm';
import { Item } from '@/shared/database/entities/item';
import { ActionService } from './action.service';
import { BusinessCode } from '@/shared/constants/business-code';
import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';

@Controller('/v1/actions')
export class ActionController {
  constructor(
    private readonly actionService: ActionService,
    private readonly contractService: ContractService,
    @InjectRepository(BlinkWhitelist)
    private readonly blinkWhitelistRepository: Repository<BlinkWhitelist>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  @Post('/blink-whitelist/claim')
  @UseInterceptors(ResponseInterceptor)
  async claimWhitelist(@Req() req: Request) {
    const userId = req['user_id'];
    const walletAddress = req.body.walletAddress as string;
    return await this.actionService.claimWhiteListReward(userId, walletAddress);
  }

  @Get('/blink-whitelist/check')
  async checkWhitelist(@Req() req: Request) {
    const userId = req['user_id'];
    const walletAddress = req.query.walletAddress as string;
    if (!walletAddress) {
      throw new BadRequestException(BusinessCode.INVALID_WALLET_ADDRESS);
    }
    const whitelist = await this.actionService.getAvailableWhitelistItem(
      userId,
      walletAddress,
    );
    const reward = whitelist?.reward ?? 0;
    return { reward };
  }

  @Get('/blink-whitelist')
  @Options('/blink-whitelist')
  async getWhitelistMetadata(@Res() res: Response) {
    const response: ActionGetResponse = {
      icon: 'https://i.postimg.cc/pTY0wqDg/aa.jpg',
      title: '2,000 $RCAT Airdrop',
      description: 'Register your Wallet to receive 2,000 $RCAT airdrop!',
      label: 'Register!',
    };
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids',
    );
    res.setHeader(
      'Access-Control-Expose-Headers',
      'X-Action-Version, X-Blockchain-Ids',
    );
    res.setHeader('Content-Type', 'application/json');
    return res.json(response);
  }

  @Post('/blink-whitelist')
  async registerWhitelist(@Body() body: any, @Res() res: Response) {
    const walletAddress = body.account;
    if (!walletAddress) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }
    const existingWhitelist = await this.blinkWhitelistRepository.findOneBy({
      walletAddress,
    });
    if (existingWhitelist) {
      return res
        .status(400)
        .json({ message: 'Wallet address already whitelisted' });
    }
    const transaction =
      await this.contractService.buildRegisterWhitelistTx(walletAddress);
    const response: ActionPostResponse = {
      type: 'transaction',
      transaction,
    };
    return res.status(200).json(response);
  }

  @Get('/blink-starter-box')
  @Options('/blink-starter-box')
  async getStarterBoxMetadata(@Req() req: Request, @Res() res: Response) {
    if (!req.query.itemId) {
      return res.status(400).json({ message: 'Invalid item id' });
    }
    const itemId = parseInt(req.query.itemId as string);
    const item = await this.itemRepository.findOneBy({ id: itemId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const response: ActionGetResponse = {
      icon: 'https://png.pngtree.com/png-clipart/20230508/original/pngtree-future-cat-robot-illustration-png-image_9150204.png',
      title: `Buy ${item.name}`,
      description: `Buy ${item.name} with 20% discount`,
      label: 'Buy with 20% discount',
    };
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids',
    );
    res.setHeader(
      'Access-Control-Expose-Headers',
      'X-Action-Version, X-Blockchain-Ids',
    );
    res.setHeader('Content-Type', 'application/json');
    return res.json(response);
  }

  @Post('/blink-starter-box')
  async buyStarterBox(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const walletAddress = body.account;
    if (!walletAddress) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }
    if (!req.query.itemId) {
      return res.status(400).json({ message: 'Invalid item id' });
    }
    const itemId = parseInt(req.query.itemId as string);
    const item = await this.itemRepository.findOneBy({ id: itemId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const transaction = await this.actionService.createBlinkBuyItemTx(
      item,
      walletAddress,
    );
    const response: ActionPostResponse = {
      type: 'transaction',
      transaction,
    };
    return res.status(200).json(response);
  }
}
