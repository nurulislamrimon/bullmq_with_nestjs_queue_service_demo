import { Module } from '@nestjs/common';
import { BullmqService } from './bullmq.config';

@Module({
  providers: [BullmqService],
  exports: [BullmqService],
})
export class BullmqModule {}
