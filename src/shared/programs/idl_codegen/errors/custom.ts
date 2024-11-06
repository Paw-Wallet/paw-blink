export type CustomError = InvalidFeeAccount | InvalidServerSigner;

export class InvalidFeeAccount extends Error {
  static readonly code = 6000;
  readonly code = 6000;
  readonly name = 'InvalidFeeAccount';
  readonly msg = 'Invalid fee acocunt';

  constructor(readonly logs?: string[]) {
    super('6000: Invalid fee acocunt');
  }
}

export class InvalidServerSigner extends Error {
  static readonly code = 6001;
  readonly code = 6001;
  readonly name = 'InvalidServerSigner';
  readonly msg = 'Invalid server signer';

  constructor(readonly logs?: string[]) {
    super('6001: Invalid server signer');
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidFeeAccount(logs);
    case 6001:
      return new InvalidServerSigner(logs);
  }

  return null;
}
