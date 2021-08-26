import { Channel } from 'amqplib';

/**
 * 
 * - Can send and recieve messages, register callbacks to handle 
 *   messages by pattern for one specific queue
 * - It parses data before sending and after receiving
 * 
 */
export class AMQPQueueHandler {
  private channel: Channel = null;
  private queueName: string = '';
  private exchangeName: string = '';
  private callbacks = {};
  private isConsumed = false;

  constructor(cn: Channel, queue: string, exchange: string) {
    this.channel = cn;
    this.queueName = queue;
    this.exchangeName = exchange;
    
    cn.on('close', () => {
      this.channel = null;
    })
    cn.on('error', () => {
      this.channel = null;
    })
  }

  /**
   * @param pattern - string in field 'action' of message data
   * @param cb      - handler
   */
  public onMessage(pattern: string, cb: Function) {
    if (!this.isConsumed) {
      this.channel.consume(this.queueName, this.onReceive.bind(this), { noAck: true });
      this.isConsumed = true;
    }
    if (!this.callbacks[pattern]) {
      this.callbacks[pattern] = [];
    }
    this.callbacks[pattern].push(cb);
    return this;
  }

  public publishMessage(pattern: string, sendData) {
    const content = Buffer.from(
      JSON.stringify({
        action: pattern, // to incapsulate message format
        ...sendData,
      })
    );
    return this.channel.publish(this.exchangeName, '', content);
  }

  public is(queueName: string) {
    return this.queueName === queueName;
  }

  private onReceive(messageRaw) {
    const message = messageRaw.content.toString();
    const parsed = JSON.parse(message);
    const actionPattern = parsed.action || '';
    const callbacks = this.callbacks[actionPattern];
    const globalCallbacks = this.callbacks['*'];
    if (actionPattern && callbacks) {
      callbacks.forEach((cb) => cb(parsed));
    }
    if (globalCallbacks) {
      globalCallbacks.forEach((cb) => cb(parsed));
    }
  }
}