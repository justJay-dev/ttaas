const Kafka = require("kafkajs").Kafka
run();
async function run() {
    try {
        //setup our kafka object / tell it where the brokers are
        const kafka = new Kafka({
            "clientId": "ttaas",
            "brokers" :["prime-sub:9092"]
        })
        //create an admin object
        const admin = kafka.admin();
        //actually connect
        console.log("connecting...")
        await admin.connect()
        console.log("connected.")

        //crate a topic
        await admin.createTopics({
            "topics": [
                {"topic" : "Toss_Requests","numPartitions" : 2},
                {"topic" : "Toss_Results", "numPartitions" : 2}
            ]
        })
        console.log("All set.")
        //all done, disconnect
        await admin.disconnect();
    }

    catch(ex) {
        console.error(`there was an error ${ex}`)
    }

    finally{
        process.exit(0)
    }

}