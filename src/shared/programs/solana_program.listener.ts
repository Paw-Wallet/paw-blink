import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection, MessageV0, PublicKey, VersionedTransactionResponse } from '@solana/web3.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BorshInstructionCoder } from '@coral-xyz/anchor';
import IDL from './idl.json';
import { PROGRAM_ID } from '@/shared/programs/idl_codegen/programId';

@Injectable()
export class SolanaListenerService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private subscriptionId: number | null = null;

  private readonly programId = new PublicKey(PROGRAM_ID);

  constructor(private eventEmitter: EventEmitter2) {}

  async onModuleInit() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
    this.startListening();
  }

  async onModuleDestroy() {
    if (this.subscriptionId !== null) {
      this.connection.removeSignatureListener(this.subscriptionId);
    }
  }

  private startListening() {
    this.subscriptionId = this.connection.onLogs(
      this.programId,
      async (logs, ctx) => {
        try {
          const transaction = await this.connection.getTransaction(logs.signature, {
            maxSupportedTransactionVersion: 0,
          });
          if (transaction) {
            this.handleProgramTransaction(transaction);
          }
        } catch (error) {
          console.error('Error parsing transaction:', error);
        }
      },
      'confirmed',
    );
  }

  async verifyTransaction(txId: string) {
    try {
      const transaction = await this.connection.getTransaction(txId, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });
      if (transaction) {
        this.handleProgramTransaction(transaction);
      } else {
        throw new NotFoundException('Transaction not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error}`);
    }
  }

  private handleProgramTransaction(transaction: VersionedTransactionResponse) {
    const coder = new BorshInstructionCoder(IDL as any);
    const instruction = coder.decode(Buffer.from(transaction.transaction.message.compiledInstructions[0].data));
    if (!instruction) {
      // console.error('Failed to decode instruction:', transaction);
      return;
    }
    console.log('Transaction:', transaction);
    console.log('Instruction:', instruction);
    const data = instruction.data as any;
    switch (instruction.name) {
      case 'pay':
        this.eventEmitter.emit('transaction.pay', {
          txId: transaction.transaction.signatures[0],
          status: transaction.meta.err ? 'failed' : 'success',
          params: {
            fee: data.params.fee.toNumber(),
            gameTxId: data.params.gameTxId.toNumber(),
          },
        });
        break;
      case 'registerWhitelist':
        this.eventEmitter.emit('transaction.registerWhitelist', {
          txId: transaction.transaction.signatures[0],
          status: transaction.meta.err ? 'failed' : 'success',
          account: (transaction.transaction.message as MessageV0).staticAccountKeys[0].toBase58(),
        });
      default:
        console.log('Unknown instruction:', instruction);
    }
  }
}
