# AMQP Queue Pull

### Назначение
Библиотека для работы со списком очередей amqp, позволяющая работать по приципу pub/sub более удобно. Позволяет отправлять сообщения после того как произойдет соединение с сервером очередей, если метод отправки сообщений был вызван до инициализации соединения, то есть сообщение будет ожидать завершения инициализации и будет отправлено. 
Библиотека реализует работу с очередью именно в паттерне **pub/sub**, так как каждая создаваемая очередь(queue) привязывается к обмену(exchange) и отправляемые сообщения публикуются в exchange, а слушаются сообщения именно в очереди.
Есть возможность проинициализировать очередь и привязать её к обмену без того чтобы слушать её сообщения - это нужно для того чтобы быть уверенным в том что все сообщения сохраняются в очереди, т.к. она может быть ещё не проинициализированна в другом сервисе (т.к. все сообщения отправляются в exchange если очередь не создана, то сообщения в неё не складываются). Для этого
 нужно не передавать обработчиков полученных сообщений и очередь не будет слушаться, что важно т.к. все очереди слушаются в режиме noAck и следовательно если есть слушатель сообщения удалаются из очереди без подтверждения, после получения слушателем.

 ### Содеражние api
 По умолчанию экспортиться синглтон класса AMQPQueuePull

 ##### AMQPQueuePull:
 - **initPull** - инициализирует соединение с сервером очередей, привязывает очереди к обменам, после чего разрешает промис инициализации (который начинает отправку сообщений)

 - **send(queueName: string, action, data)** - отправляет сообщение в обмен который привязан к переданной очереди. *action* - поле отправляемое в объекте data, служить для описания назначения сообщения по которому потом матчатся подписки на сообщения.

 - **on(queueName: string, action: string, cb)** - подписка на сообщения в очереди. *action* - поле в объекте data сообщения.

 - **get** - получает экземпляр класса конкретной очереди AMQPQueueHandler.