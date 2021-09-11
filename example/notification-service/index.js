const queuePull = require('../build').default;

console.log('Notification service is starting');

const QUEUE_NOTIFY = process.env.QUEUE_NOTIFY; 
const EXCHANGE_NOTIFY = process.env.EXCHANGE_NOTIFY;

const amqpHost = process.env.AMQP_HOST || 'localhost';
const amqpUrl = `amqp://${amqpHost}`;

const options = [
  {
    queue: QUEUE_NOTIFY,
    exchange: EXCHANGE_NOTIFY,
  },
];

async function run() {
  const initializedPull = await queuePull.initPull(amqpUrl, options, 10000);
  
  const notificationsQueue = await initializedPull.get(QUEUE_NOTIFY);
  notificationsQueue.onMessage('out-of-stock', (msg) => {
    console.log('Notification service received out-of-stock message and email will be send to manager, after you implement it.');
  });
}

run();

