const queuePull = require('../build').default;

console.log('Trade service is starting');

const QUEUE_TRADE = process.env.AMQP_HOST; 
const QUEUE_NOTIFY = process.env.QUEUE_NOTIFY; 
const QUEUE_WAREHOUSE = process.env.QUEUE_WAREHOUSE; 
const EXCHANGE_TRADE = process.env.EXCHANGE_TRADE; 
const EXCHANGE_NOTIFY = process.env.EXCHANGE_NOTIFY;

const amqpHost = process.env.AMQP_HOST || 'localhost';
const amqpUrl = `amqp://${amqpHost}`;

const options = [
  {
    queue: QUEUE_TRADE,
    exchange: EXCHANGE_TRADE,
  },
  {
    queue: QUEUE_NOTIFY,
    exchange: EXCHANGE_NOTIFY,
  },
];

async function run() {
  queuePull.initPull(amqpUrl, options, 10000);
  console.log('Before send first messages, you dont need to wait queue initialization');
  // you can use current queue name to send message to exchange and othe queues that bounded
  // to same exchange will receive it message
  queuePull.send(QUEUE_TRADE, 'sold', { productName: 'firstTestProduct' });
  queuePull.send(QUEUE_TRADE, 'out-of-stock', { productName: 'firstTestProduct' });
  // you can use other queues names to send messages to their exchange
  queuePull.send(QUEUE_NOTIFY, 'out-of-stock', { productName: 'firstTestProduct' });
  
  queuePull.on(QUEUE_TRADE, '*', (msg) => {
    console.log('Trade service received message:', msg);
  });

  setInterval(() => {
    queuePull.send(QUEUE_TRADE, 'sold', { productName: 'testProduct' });
    queuePull.send(QUEUE_TRADE, 'out-of-stock', { productName: 'testProduct' });
  }, 10000);


}

run();

