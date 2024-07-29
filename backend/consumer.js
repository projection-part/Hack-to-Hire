const { Kafka } = require("kafkajs");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["192.168.225.8:9092"],
});

const consumer = kafka.consumer({ groupId: "flight-group" });
const mongoUri = "mongodb://127.0.0.1:27017";
const dbName = "flightDB";
const client = new MongoClient(mongoUri);

const accountSid = 'ACe0cf6f6a24bf323b1d2081e8cf6d3e12';
const authToken = '22cf8f293ccb41dc9387114e5f7c6c2f';

const twilioClient = twilio("accountSid", "authToken");

async function sendNotification(notification) {
  switch (notification.method) {
    case "SMS":
      await twilioClient.messages.create({
        body: notification.message,
        from: "+18432427217",
        to: notification.recipient,
      });
      break;
    case "Email":
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "umashinballia@gmail.com",
          pass: "gpthrvnnryqsggru",
        },
      });

      await transporter.sendMail({
        from: "umashinballia@gmail.com",
        to: notification.recipient,
        subject: "Flight Status Update",
        text: notification.message,
      });
      break;
    case "App":
      // Implement app notification logic here
      console.log(`App notification to ${notification.recipient}: ${notification.message}`);
      break;
  }
}

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: "flight_status_updates", fromBeginning: true });
  await consumer.subscribe({ topic: "flight_notifications", fromBeginning: true });

  await client.connect();
  console.log("MongoDB connected");

  const db = client.db(dbName);
  const flightCollection = db.collection("flights");
  const notificationCollection = db.collection("notifications");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgValue = JSON.parse(message.value.toString());

      if (topic === "flight_status_updates") {
        await flightCollection.insertOne(msgValue);
        console.log("Flight data stored in MongoDB:", msgValue);
      }

      if (topic === "flight_notifications") {
        await notificationCollection.insertOne(msgValue);
        console.log("Notification data stored in MongoDB:", msgValue);
        await sendNotification(msgValue);
        console.log("Notification sent:", msgValue);
      }
    },
  });
}

run().catch(console.error);
