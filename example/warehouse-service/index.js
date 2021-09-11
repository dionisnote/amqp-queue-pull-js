const queuePull = require('../build').default;

console.log('Warehouse service is starting');

const QUEUE_NOTIFY = process.env.QUEUE_NOTIFY; 
const QUEUE_WAREHOUSE = process.env.QUEUE_WAREHOUSE; 
const EXCHANGE_TRADE = process.env.EXCHANGE_TRADE; 
const EXCHANGE_NOTIFY = process.env.EXCHANGE_NOTIFY;

const amqpHost = process.env.AMQP_HOST || 'localhost';
const amqpUrl = `amqp://${amqpHost}`;

const options = [
  {
    queue: QUEUE_WAREHOUSE,
    exchange: EXCHANGE_TRADE,
  },
  {
    queue: QUEUE_NOTIFY,
    exchange: EXCHANGE_NOTIFY,
  },
];

async function run() {
  const initializedPull = await queuePull.initPull(amqpUrl, options, 10000);
  
  const warehouseQueue = await initializedPull.get(QUEUE_WAREHOUSE);
  warehouseQueue.onMessage('out-of-stock', (msg) => {
    console.log('Warehouse received message:', msg);
  });
  setTimeout(() => {
    // you don't need to know what queues bind to its exchange
    warehouseQueue.publishMessage('new-product', { productName: 'newTestProduct' });
  }, 5000);
}

run();

