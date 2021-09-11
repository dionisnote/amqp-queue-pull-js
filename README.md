# AMQP Queue Pull

### Package description
Wrapper for library "amqplib"(wich allows to work with rabbitmq), written in typescript. Wrapper helps to quick start to work with rabbitmq. But its opportunities are limited to pub/sub pattern, it means you can only publish messages to exchange(in terms of rabbitmq) and listen messages from exchanges. 

### API short description
- initPull - method that inits all queues and exchanges, creates them if they doesnt exists and connects to them. This method is awaitable, so you can wait for connection to rabbitmq and queues initialization to make sure all that stuff is ready to work. But it is not necessary to wait of queue initialization before starting app, you can send and subscribe to messages beacause `send` and `on` methods do that underhood.
- send - method to send messages into exchange that passed queue is bounded, so all queues in exchange can receive sended message, to split messages between listeners use second argument('action'), for details look at [example](./example/README.md)
- on - method for listening messages in queue [example of use i example folder](./example/README.md)