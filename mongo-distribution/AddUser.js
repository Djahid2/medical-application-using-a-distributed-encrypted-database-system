const { MongoClient } = require("mongodb");

const NODE_URI = "mongodb://localhost:27021"; 

const sampleUser = {
  username: "usernameeee",
  email: "usernameeee@gmail.com",
  password: "password123", 
};

async function addUser(data) {
  const client = new MongoClient(NODE_URI);

  try {
    await client.connect();
    const db = client.db("UserDB"); 
    const collection = db.collection("User"); 
    await collection.insertOne(data);
    console.log("User created successfully!");
  } finally {
    await client.close();
  }
}

async function main() {
  await addUser(sampleUser);
}

main().catch(console.error);
