const { MongoClient } = require('mongodb');
const NODE_URI = 'mongodb://localhost:27021';

exports.addUser = async (data) => {
  const client = new MongoClient(NODE_URI);
  try {
    await client.connect();
    const db = client.db('UserDB');
    const collection = db.collection('User');

    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email déjà utilisé.');
    }

    await collection.insertOne(data);
    console.log('Utilisateur ajouté avec succès.');
  } finally {
    await client.close();
  }
};
