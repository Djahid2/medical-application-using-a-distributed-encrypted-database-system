const { MongoClient } = require("mongodb");
const Key = require("../crypto/modules/key");

const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

async function modifyData(matricule, modifiedData) {
    let modifiedCount = 0;
    const matriculeHashed = Key.hmacSHA256(matricule.toString()).toString("hex"); // Hash the matricule
  
    for (const uri of NODE_URIS) {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection("dossier_medical");
  
        // Find the current object in the database
        const existingData = await collection.findOne({ _id: matriculeHashed });
        if (!existingData) {
          console.log(`No record found in database at ${uri}`);
          continue;
        }
  
        // Check for matching attributes to modify
        const attributesToModify = {};
        for (const [key, value] of Object.entries(modifiedData)) {
          if (key in existingData) {
            attributesToModify[key] = value; 
          }
        }
  
        if (Object.keys(attributesToModify).length > 0) {
          const result = await collection.updateOne(
            { _id: matriculeHashed },
            { $set: attributesToModify }
          );
  
          if (result.modifiedCount > 0) {
            modifiedCount += result.modifiedCount;
            console.log(`Modified data in database at ${uri}`);
          }
        } else {
          console.log(`No matching attributes to modify in database at ${uri}`);
        }
      } catch (err) {
        console.error(`Error connecting to ${uri}:`, err.message);
      } finally {
        await client.close();
      }
    }
  
    if (modifiedCount > 0) {
      console.log(`Successfully modified ${modifiedCount} records for matricule ${matricule}.`);
    } else {
      console.log(`No records found for matricule ${matricule} to modify.`);
    }
  
    return modifiedCount;
  }
  
  
modifyData(20241631002,{
    emergency_contact: '{"name":"Amimer","relation":"IDK","phone":"0559630016"}',
    symptoms: '[{"symptom":"bochoka","onset":"2024-05-01"}]'
})