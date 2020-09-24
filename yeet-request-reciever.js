const Kafka = require("kafkajs").Kafka;
listen();
/*
async function calc(weight, time, distance) {
  var m = weight / 9.8;
  var distanceInMeters = distance / 3.28;
  var a = (2 * distanceInMeters) / Math.pow(time, 2);
  var f = m * a;
  var msg = `the force in netwons required to toss a tiny person ${distance} feet, given a flight time of ${time}, is ${f}`;
  try {
    const producer = kafka.producer();

    console.log("connecting..");
    await producer.connect();
    console.log("connected");

    const result = await producer.send({
      topic: "Toss_Results",
      messages: [
        {
          value: msg,
          partition: 1,
        },
      ],
    });
    console.log(`success ${JSON.stringify(result)}`);

    await producer.disconnect();
  } catch (ex) {
    console.error(`something went wrong ${ex}`);
  }
}
*/
async function listen() {
  try {
    const kafka = new Kafka({
      clientId: "ttaas",
      brokers: ["prime-sub:9092"],
    });

    const consumer = kafka.consumer({ groupId: "req-rec" });

    console.log("connecting...");
    await consumer.connect();
    console.log("connected");

    //do science
    consumer.subscribe({ topic: "Toss_Requests", fromBeginning: false });

    await consumer.run({
      eachMessage: async (result) => {
        var msg = result.message.value.split(" ");

        calc(msg[0], msg[1], msg[2]);
        console.log(
          `recd msg ${result.message.value} on part ${result.partition}`
        );
      },
    });
  } catch (ex) {
    console.error(`something bad happened ${ex}`);
  }
}
