import amqp from 'amqplib';
import { AMQPQueueHandler } from './AMQPQueueHandler'

export type ChannelOption = {
  queue: string;
  exchange: string;
}

export const initChannels = async (amqpUrl: string, channelOptions: ChannelOption[], amqpLib: typeof amqp ) => {
  const connection = await amqpLib.connect(amqpUrl);
  return Promise.all(channelOptions.map(async (opt) => {
    const ch = await connection.createChannel();
    await ch.assertExchange(opt.exchange, 'fanout', { durable: false });
    await ch.assertQueue(opt.queue, { durable: false });
    await ch.bindQueue(opt.queue, opt.exchange, '');
    return new AMQPQueueHandler(ch, opt.queue, opt.exchange);
  }));
}
