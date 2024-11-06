import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface PayArgs {
  params: types.PayParamsFields;
}

export interface PayAccounts {
  user: PublicKey;
  server: PublicKey;
  feeAccount: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.PayParams.layout('params')]);

export function pay(args: PayArgs, accounts: PayAccounts, programId: PublicKey = PROGRAM_ID) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.server, isSigner: true, isWritable: false },
    { pubkey: accounts.feeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([119, 18, 216, 65, 192, 117, 122, 220]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.PayParams.toEncodable(args.params),
    },
    buffer,
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
