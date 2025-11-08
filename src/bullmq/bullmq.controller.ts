import { Controller, Post, Body } from '@nestjs/common';
import { BullmqService } from './bullmq.config';

@Controller('email')
export class EmailController {
  constructor(private readonly bullmqService: BullmqService) {}

  @Post('send')
  async sendEmail(@Body() body: { email: string }) {
    await this.bullmqService.addEmailJob({ email: body.email }, 5000);
    return { message: 'Email job scheduled' };
  }
}
