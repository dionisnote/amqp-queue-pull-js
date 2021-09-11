# Example

#### run
To run example run following commands in root folder of repository one by one. You should have installed docker, docker-compose, nodejs with yarn.
`yarn`
`yarn build`
`docker-compose -f ./example-compose.yml build`
`docker-compose -f ./example-compose.yml up`
all microservices starts in one container and have combined output to console.

#### description
In this example we have 3 demo microservices, that only logs received messages and two of them send messages sometimes. Main rule to sending messages is that you can use in methods like `send` and ` on` only queues names that was defined in options passed to initPull.
- *trade-service*:
  First of all demonstrate posibility to do not wait when initPull method will be resolved, you can just call `send` and `on` methods in your app logic. It uses current, for this microservice, queue name (`QUEUE_TRADE`) to send messages, it means that you don't need to know what other microservices queue bounded to this queue exchange (`EXCHANGE_TRADE`). And other microservice starts receive messages from this exchange to their own queues after start, but all messages that was sended by `trade-service` before microservices starts will be lost. If you want to save that messages, you need to add to options passed to initPull method queues where you expect to receive messages from current service, then that queues will be created and start collect messages.
  Second thing is that you need to setup queues from other exchanges like QUEUE_NOTIFY to send messages to it. Supposed you use exchanges as a logic layers. In this example we have two logic layers its trading operations and notifications. Notifacation can be sended by many reasons. For example if we would have one more microsecrice "clients-complaints" then we have to specify QUEUE_NOTIFY with EXCHANGE_NOTIFY in options to send messages in notification service from clients-complaints, but EXCHANGE_TRADE belongs to separate logic layer of our application. Main pattern is specify in options only current queue from current logic layer and queues of reusable microservices that you need in current microservice, it allows you to scale every logic layer.
  Next thing is that you can receive all messages, independ on what action was passed, by providing `*` symbol as a second argument in `queuePull.on` method. Thats why `trade-service` all messages even that was sended by it self.
- *warehouse-service*:
  Shows another way to start work with queue. First we wait for initPull before launch our app, then we get specific queue object `warehouseQueue` and then call its methods to send and receive messages(`onMessage` and `publishMessage`). You can inject this object in some other classes and do not import queue name.
  Futhermore it shows how to subscribe to specific messages, `out-of-stock` in this case. So `warehouse-service` will console.log only `out-of-stock` messages. Messages with type `sold` that trade-service sends in `EXCHANGE_TRADE` wont be process by `warehouse-service`.
- *notification-service*:
  Is an example of simple service that don't know about other services and ther exchanges, it only know of types of messages like `out-of-stock` and how to handle them when received. 