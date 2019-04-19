# chat-example-kafka

This is a demo chat application modified from the sample app from https://socket.io/get-started/chat/ to use Apache Kafka for distributing chat messages. This allows multiple instances of the application talk to each other by connecting to the same Kafka cluster.

First download the source code.

If you are on Mac OS High Sierra / Mojave, you must set the following environment variables before installing the node packages:
```
$ export CPPFLAGS=-I/usr/local/opt/openssl/include
$ export LDFLAGS=-L/usr/local/opt/openssl/lib
```

Then run:
```
$ npm install
```

The following steps assume you have Apache Kafka installed locally.

First start ZooKeeper:
```
$ zookeeper-server-start zookeeper.properties
```

Then start two Kafka brokers:
```
$ kafka-server-start server.properties
$ kafka-server-start server-1.properties
```

Then create a "chat" topic in Kafka:
```
$ kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic chat
```

Then in one console, run:
```
$ export SERVER_ID=0
$ export PORT=3000
$ node index.js
```

In another console, run:
```
$ export SERVER_ID=1
$ export PORT=4000
$ node index.js
```

In one browser window, navigate to http://localhost:3000 and in another, navigate to http://localhost:4000. These will connect to the two different chat servers you started, but because each server is connected to the same Kafka cluster, messages you type in one window will appear in the other window.
