import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullmqModule } from './bullmq/bullmq.module';
import { EmailController } from './bullmq/bullmq.controller';

@Module({
  imports: [BullmqModule],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule {}
