import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActionModule } from './modules/actions/action.module';
import { ContractModule } from './modules/contract/contract.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [FileModule, ContractModule, ActionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
