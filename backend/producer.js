const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["192.168.225.8:9092"],
});

const producer = kafka.producer();

const flightData = [
  {
    flight_id: "6E 2341",
    airline: "Indigo",
    status: "On Time",
    departure_gate: "A12",
    arrival_gate: "B7",
    scheduled_departure: "2024-07-26T14:00:00Z",
    scheduled_arrival: "2024-07-26T18:00:00Z",
    actual_departure: null,
    actual_arrival: null,
  },
  {
    flight_id: "6E 2342",
    airline: "Indigo",
    status: "Delayed",
    departure_gate: "C3",
    arrival_gate: "D4",
    scheduled_departure: "2024-07-26T16:00:00Z",
    scheduled_arrival: "2024-07-26T20:00:00Z",
    actual_departure: null,
    actual_arrival: null,
  },
  {
    flight_id: "6E 2343",
    airline: "Indigo",
    status: "Cancelled",
    departure_gate: "E2",
    arrival_gate: "F1",
    scheduled_departure: "2024-07-26T12:00:00Z",
    scheduled_arrival: "2024-07-26T16:00:00Z",
    actual_departure: null,
    actual_arrival: null,
  },
];

const notificationData = [
  {
    notification_id: "1",
    flight_id: "6E 2341",
    message: "Your flight 6E 2341 is on time. Departure gate: A12.",
    timestamp: "2024-07-26T13:00:00Z",
    method: "SMS",
    recipient: "+1234567890",
  },
  {
    notification_id: "2",
    flight_id: "6E 2342",
    message: "Your flight 6E 2342 is delayed. New departure time: 2024-07-26T17:00:00Z. Departure gate: C3.",
    timestamp: "2024-07-26T15:30:00Z",
    method: "Email",
    recipient: "umashinballia@gmail.com",
  },
  {
    notification_id: "3",
    flight_id: "6E 2343",
    message: "Your flight 6E 2343 has been cancelled.",
    timestamp: "2024-07-26T11:00:00Z",
    method: "App",
    recipient: "user_app_id_12345",
  },
];

async function sendMessage(topic, messages) {
  await producer.send({
    topic,
    messages,
  });
}

async function run() {
  await producer.connect();
  console.log("Producer connected");

  const flightMessages = flightData.map(flight => ({
    value: JSON.stringify(flight),
  }));

  const notificationMessages = notificationData.map(notification => ({
    value: JSON.stringify(notification),
  }));

  await sendMessage("flight_status_updates", flightMessages);
  console.log("Flight data sent to flight_status_updates topic");

  await sendMessage("flight_notifications", notificationMessages);
  console.log("Notification data sent to flight_notifications topic");

  await producer.disconnect();
  console.log("Producer disconnected");
}

run().catch(console.error);
