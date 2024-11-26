const { MongoClient } = require('mongodb');
const NODE_URI = 'mongodb://localhost:27021';

exports.connectToDatabase = async () => {
  const client = new MongoClient(NODE_URI);
  await client.connect();
  return client;
};
