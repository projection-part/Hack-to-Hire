# Hack-to-Hire
## Prerequisite
- Knowledge
  - Node.JS Intermediate level
  - Experience with designing distributed systems
- Tools
  - Node.js: [Download Node.JS](https://nodejs.org/en)
  - Docker: [Download Docker](https://www.docker.com)
  - VsCode: [Download VSCode](https://code.visualstudio.com)

## Commands to run Docker and Kafka
- Start Zookeeper Container and expose PORT `2181`.
```bash
docker run -p 2181:2181 zookeeper
```
- Start Kafka Container, expose PORT `9092` and setup ENV variables.
```bash
docker run -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka
```
## how to run project

- step 1- open backend folder and install dependencies node module
```bash
    npm i
```
- step 2- Update this line 
    brokers: ["192.168.225.8:9092"] = brokers: ["<Your_private_IP>:9092"]
    in the backend folder in all files where ever written this , replace your Private IP

- step 3- To produce data from mock data run producer.js file
```bash
    node producer.js
```

- step 4- to consume data and store data in database and send notification run consumer.js file
```bash
    node consumer.js
```
- step 5- Run server.js file
```bash
    node server.js
```
- step 6- Open the frontend folder and install dependencies node module and then start.
```bash
    npm i
    npm start
```

## how you can check notification test
- For SMS get you own twilio credentials replace with existing
- For email get you own Email credentials replace with existing
- That is how it can be tested
