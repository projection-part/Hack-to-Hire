const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "my-app",
  brokers: ["192.168.225.8:9092"],
});

async function init() {
  const admin = exports.kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connection Success...");

  console.log("Creating Topics [flight_status, flight_notification]");
  await admin.createTopics({
    topics: [
      { topic: "flight_status", numPartitions: 2 },
      { topic: "flight_notification", numPartitions: 2 },
    ],
  });
  console.log("Topics Created Success [flight_status, flight_notification]");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

init();
