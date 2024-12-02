const { MongoClient } = require('mongodb');
const NODE_URI = 'mongodb://localhost:27021';
const mongoose = require('mongoose');
const FailedLoginAttempt = require('../Controller/Failedlogin');

exports.connectToDatabase = async () => {
  const client = new MongoClient(NODE_URI);
  await client.connect();
  console.log('Connecté à MongoDB');
  return client;
};

mongoose.connect(NODE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connecté à MongoDB avec Mongoose');
}).catch((error) => {
  console.error('Erreur de connexion avec Mongoose:', error);
});
