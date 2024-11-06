import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface PayParamsFields {
  fee: BN;
  gameTxId: BN;
}

export interface PayParamsJSON {
  fee: string;
  gameTxId: string;
}

export class PayParams {
  readonly fee: BN;
  readonly gameTxId: BN;

  constructor(fields: PayParamsFields) {
    this.fee = fields.fee;
    this.gameTxId = fields.gameTxId;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64('fee'), borsh.u64('gameTxId')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PayParams({
      fee: obj.fee,
      gameTxId: obj.gameTxId,
    });
  }

  static toEncodable(fields: PayParamsFields) {
    return {
      fee: fields.fee,
      gameTxId: fields.gameTxId,
    };
  }

  toJSON(): PayParamsJSON {
    return {
      fee: this.fee.toString(),
      gameTxId: this.gameTxId.toString(),
    };
  }

  static fromJSON(obj: PayParamsJSON): PayParams {
    return new PayParams({
      fee: new BN(obj.fee),
      gameTxId: new BN(obj.gameTxId),
    });
  }

  toEncodable() {
    return PayParams.toEncodable(this);
  }
}
