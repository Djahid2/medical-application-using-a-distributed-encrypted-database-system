# MongoDB Distributed System

This project sets up a MongoDB-based distributed system with multiple nodes running in Docker containers or locally. The system distributes data randomly across multiple nodes to simulate high availability and scalability.

## Prerequisites

- **Docker**: Ensure Docker is installed on your machine. [Download Docker](https://www.docker.com/get-started).
- **Node.js**: Ensure Node.js is installed. [Download Node.js](https://nodejs.org/).
- **MongoDB**: MongoDB should be set up either via Docker or manually.

## Project Setup

### 1. Install Node.js Dependencies

To install the required dependencies for the project, run the following commands:

```bash
cd mongo-distribution
npm install
```

Ensure that the following directories exist on your machine to store MongoDB data:

```plaintext

C:\data
    ├── db1
    ├── db2
    ├── db3
    ├── db4
    └── Userdb
    

```

To run the database using docker:

```bash
docker-compose up -d
```

Or you can run it without docker :

```bash
mongod --port 27017 --dbpath C:\data\db1 --logpath C:\data\db1\mongo.log
mongod --port 27018 --dbpath C:\data\db2 --logpath C:\data\db2\mongo.log
mongod --port 27019 --dbpath C:\data\db3 --logpath C:\data\db3\mongo.log
mongod --port 27020 --dbpath C:\data\db4 --logpath C:\data\db4\mongo.log
```

To Insert data into the database:

```bash
node InsertData.js
```

And to close the docker containers :
To run the database using docker:

```bash
docker-compose down
```
