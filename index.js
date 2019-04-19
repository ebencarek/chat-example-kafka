var app = require('express')();
var http = require('http').createServer(app);
var Kafka = require('node-rdkafka');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var serverId = process.env.SERVER_ID || "0"

// create a producer to write to the 'chat' topic
// using local brokers, this app is for demo purposes only
var writeStream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': 'localhost:9092,localhost:9093'
}, {}, {
  topic: 'chat'
});

writeStream.on("error", function(e) {
  console.log(e);
});

// create a consumer to read from the 'chat' topic
var readStream = Kafka.KafkaConsumer.createReadStream({
  'metadata.broker.list': 'localhost:9092,localhost:9093',
  'group.id': serverId
}, {}, {
  topics: ['chat']
});

// when a message is published to the "chat" topic,
// notify the frontend
readStream.on("data", function(message) {
  var chat = message.value.toString();
  console.log("Received Kafka message: " + chat);
  io.emit("chat message", chat);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    // when we receive a chat from the frontend,
    // write to the "chat" topic in Kafka
    writeStream.write(Buffer.from(msg))
    console.log("Writing to Kafka: " + msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
