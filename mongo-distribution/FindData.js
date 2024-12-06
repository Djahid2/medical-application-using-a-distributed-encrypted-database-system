const { MongoClient } = require("mongodb");
const Key = require("../crypto/modules/key");

const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

async function findData(matricule) {
    let data = {};
    const matriculeHashed = Key.hmacSHA256(matricule.toString()).toString("hex"); // Hash the matricule
  
    for (const uri of NODE_URIS) {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection("dossier_medical");
  
        const partialData = await collection.findOne({ _id: matriculeHashed }); // Use the hashed matricule for query
  
        if (partialData) {
          data = { ...data, ...partialData }; // Merge data from different nodes
        }
      } catch (err) {
        console.error(`Error connecting to ${uri}:`, err.message);
      } finally {
        await client.close();
      }
    }
  
    if (Object.keys(data).length > 0) {
      console.log("Combined Data found:", data);
    } else {
      console.log(`No data found for matricule ${matricule}`);
    }
  
    return data;
  }
  

findData(20241631001)