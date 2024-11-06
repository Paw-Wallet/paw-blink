import { Injectable } from '@nestjs/common';
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
} from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import {
  pay,
  registerWhitelist,
} from '@/shared/programs/idl_codegen/instructions';

@Injectable()
export class ContractService {
  connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');

  constructor() {}

  async buildPayTx(userPubkey: string, fee: number, gameTxId: number) {
    const wallet = new PublicKey(userPubkey);
    const blockhash = (await this.connection.getLatestBlockhash('confirmed'))
      .blockhash;

    const message = new TransactionMessage({
      payerKey: wallet,
      instructions: [
        pay(
          {
            params: {
              fee: new BN(fee * 10 ** 9),
              gameTxId: new BN(gameTxId),
            },
          },
          {
            user: wallet,
            server: new PublicKey(process.env.SIGNER_ADDRESS),
            feeAccount: new PublicKey(process.env.FEE_ADDRESS),
            systemProgram: SystemProgram.programId,
          },
        ),
      ],
      recentBlockhash: blockhash,
    });
    const versionedTx = new VersionedTransaction(message.compileToV0Message());
    versionedTx.sign([
      Keypair.fromSecretKey(
        Buffer.from(bs58.decode(process.env.SIGNER_PRIVATE_KEY)),
      ),
    ]);
    const data = versionedTx.serialize();
    return Buffer.from(data).toString('base64');
  }

  async buildRegisterWhitelistTx(userPubkey: string) {
    const wallet = new PublicKey(userPubkey);
    const blockhash = (await this.connection.getLatestBlockhash('confirmed'))
      .blockhash;

    const message = new TransactionMessage({
      payerKey: wallet,
      instructions: [
        registerWhitelist({
          user: wallet,
          server: new PublicKey(process.env.SIGNER_ADDRESS),
          systemProgram: SystemProgram.programId,
        }),
      ],
      recentBlockhash: blockhash,
    });

    const versionedTx = new VersionedTransaction(message.compileToV0Message());
    versionedTx.sign([
      Keypair.fromSecretKey(
        Buffer.from(bs58.decode(process.env.SIGNER_PRIVATE_KEY)),
      ),
    ]);
    const data = versionedTx.serialize();
    return Buffer.from(data).toString('base64');
  }
}
