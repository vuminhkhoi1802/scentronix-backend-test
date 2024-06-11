import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FindServerService } from './services/findServer.service';
import { FindServerController } from './controllers/findServer.controller';

@Module({
  imports: [HttpModule],
  controllers: [FindServerController],
  providers: [FindServerService],
})
export class AppModule {}
