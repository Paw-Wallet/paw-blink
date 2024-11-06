import { Logger, Module } from '@nestjs/common';
import { ContractService } from './contract.service';

@Module({
  controllers: [],
  providers: [ContractService, Logger],
  exports: [ContractService],
})
export class ContractModule {}
