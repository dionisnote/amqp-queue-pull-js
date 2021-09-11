import amqp from 'amqplib';
import { initChannels, ChannelOption } from './AMQPConnection';
import { AMQPQueueHandler } from './AMQPQueueHandler'

class AMQPQueuePull {
  queuesList: AMQPQueueHandler[] = [];
  private initPromiseRes = null;
  private initializationPromise = new Promise((_s, _j) => {  this.initPromiseRes = _s });
  private isInited: boolean = false;
  private isReady: boolean = false;

  async initPull(amqpUrl: string, channelOptions: ChannelOption[], reconnectMs: number = 1000 ) {
    if (!this.isInited) {
      await this.whenMQReady(amqpUrl, reconnectMs);
      await initChannels(amqpUrl, channelOptions, amqp)
        .then((queuesList) => {
          this.queuesList = queuesList;
          this.isInited = true;
          this.initPromiseRes(true);
        });
      
      await this.initializationPromise;
    }
    return this;
  }

  /**
   * Sending message to exchange where queue were bound
   * 
   * @param queueName - name of queue
   * @param action    - action is like messages group id, it uses to subscribe 
   * @param data      - data to send
   */
  public async send(queueName: string, action, data) {
    const queue = await this.get(queueName);
    if (queue) {
      queue.publishMessage(action, data);
    }
  }

    /**
   * Subscribe to messages in queue. 
   * 
   * @param queueName - name of queue
   * @param action    - action is like messages group id.
   * @param data      - sended data
   * 
   */
  public async on(queueName: string, action: string, cb) {
    const queue = await this.get(queueName);
    if (queue) {
      queue.onMessage(action, cb);
    }
  }

  public async get(queueName: string) {
    if (!this.isInited && this.initializationPromise) {
      await this.initializationPromise;
    }
    if (this.queuesList) {
      return this.queuesList.find((q) => q.is(queueName));
    }
    return null;
  }

  private whenMQReady(amqpUrl, waitMs: number = 1000) {
    if (this.isReady) {
      return Promise.resolve(true);
    }
    return new Promise((res, _rej) => {
      let isResposed = true;
      const intervalId = setInterval(async () => {
        console.log('No queue yet...');
        if (!isResposed) {
          return;
        }
        console.log('try queue connection');
        isResposed = false;
        amqp.connect(amqpUrl)
          .then(() => { 
            console.log('Queue connected!');
            this.isReady = true;
            clearInterval(intervalId);
            res(true);
          })
          .catch(() => null)
          .finally(() => { isResposed = true });
      }, waitMs);
    });
  }
}

export const queuePull = new AMQPQueuePull();
