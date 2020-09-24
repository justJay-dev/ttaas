const express = require("express");
const { nextTick } = require("process");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const Kafka = require("kafkajs").Kafka;

async function run(weight, time, distance) {
  try {
    const kafka = new Kafka({
      clientId: "ttaas",
      brokers: ["prime-sub:9092"],
    });

    const producer = kafka.producer();

    console.log("connecting..");
    await producer.connect();
    console.log("connected");

    const result = await producer.send({
      topic: "Toss_Requests",
      messages: [
        {
          value: weight + ", " + time + ", " + distance,
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



app.get("/yeet/:weight/:time/:distance", function (req, res) {
  var weight = req.params.weight;
  var time = req.params.time;
  var distance = req.params.distance;
  run(weight, time, distance);
  res.send("got it");
});

app.post("/yeet", function (req, res) {
  var weight = req.body.weight;
  var time = req.body.time;
  var distance = req.body.distance;
  run(weight, time, distance);
  res.send("got it");
});

app.listen(42069, () => {
  console.log("Server running on port 42069");
});
