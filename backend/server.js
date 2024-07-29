
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());


// MongoDB setup
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let flightCollection;
let notificationCollection;

async function connectToMongoDB() {
  await client.connect();
  const database = client.db("flightDB");
  flightCollection = database.collection("flights");
  notificationCollection = database.collection("notifications");
  console.log("Connected to MongoDB");
}

app.get("/flights", async (req, res) => {
  try {
    const flights = await flightCollection.find().toArray();
    res.json(flights);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get("/notifications", async (req, res) => {
  try {
    const notifications = await notificationCollection.find().toArray();
    res.json(notifications);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, async () => {
  try {
    await connectToMongoDB();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
});