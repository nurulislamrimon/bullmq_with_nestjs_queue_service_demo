import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, QueueEvents } from 'bullmq';
import { RedisOptions } from 'ioredis';

@Injectable()
export class BullmqService implements OnModuleInit, OnModuleDestroy {
  private connection: RedisOptions = {
    host: '127.0.0.1',
    port: 6379,
  };

  public queue: Queue;
  private worker: Worker;
  private events: QueueEvents;

  onModuleInit() {
    // ✅ Use same queue name everywhere
    const queueName = 'emailQueue';

    this.queue = new Queue(queueName, { connection: this.connection });

    // Worker listens for tasks
    this.worker = new Worker(
      queueName,
      async (job) => {
        console.log(`⚙️ Worker processing job ${job.id}:`, job.data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.handleEmail(job?.data);
      },
      { connection: this.connection, concurrency: 5 },
    );

    this.events = new QueueEvents(queueName, { connection: this.connection });
    this.events.on('completed', ({ jobId }) =>
      console.log(`✅ Job ${jobId} completed`),
    );
    this.events.on('failed', ({ jobId, failedReason }) =>
      console.log(`❌ Job ${jobId} failed: ${failedReason}`),
    );

    this.worker.on('error', (err) => console.error('Worker error:', err));
    console.log('🚀 BullMQ Worker is running');
  }

  async handleEmail(data: Record<string, string>) {
    console.log(`📧 Sending email to ${data?.email}`);
    await new Promise((r) => setTimeout(r, 1500)); // simulate work
  }

  async addEmailJob(data: Record<string, string>, delayMs?: number) {
    const job = await this.queue.add('sendEmail', data, {
      delay: delayMs || 0,
    });
    console.log(`🧾 Added job ${job.id} for ${data.email}`);
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.queue?.close();
    await this.events?.close();
  }
}
