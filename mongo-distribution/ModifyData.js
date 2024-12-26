const { MongoClient } = require("mongodb");
const Key = require("../crypto/modules/key");
const { findData, findKey } = require('./FindData');
const { extract_positions, RevealKey } = require('../crypto/modules/extract_positions.js');
require('../crypto/modules/aesCTR.js'); 
const Aes = require('../crypto/modules/aes.js');

const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

function insertAt(string, insert, position) {
  return string.slice(0, position) + insert + string.slice(position);
}

async function modifyData(matricule, modifiedData) {
  let key = "";

  try {
    key = await findKey(matricule);
    console.log("Encryption key:", key);
  } catch (error) {
    console.error("Error in findKey:", error);
    return 0;
  }
  let cryptedModifiedData = {}
    let modifiedCount = 0;
    const matriculeHashed = Key.hmacSHA256(matricule.toString()).toString("hex");

    for (const [attribute, value] of Object.entries(modifiedData)) {
      const encryptedValue = Aes.Ctr.encrypt(value, key, 256);

      if (attribute === "emergency_contact" || attribute === "lab_results") {
        const positions = extract_positions(matriculeHashed);
        let result = "";
        if(attribute === "emergency_contact"){
          const keyPart = key.slice(0, 3);
           result = insertAt(encryptedValue, keyPart, positions[0]);
        }else{
          const keyPart = key.slice(6, 9);
           result = insertAt(encryptedValue, keyPart, positions[2]);
        }
        cryptedModifiedData[attribute] = result;
      } else {
        cryptedModifiedData[attribute] = encryptedValue;
      }
    }
  
    for (const uri of NODE_URIS) {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection("dossier_medical");
        const existingData = await collection.findOne({ _id: matriculeHashed });
        if (!existingData) {
          console.log(`No record found in database at ${uri}`);
          continue;
        }
        const attributesToModify = {};
        for (const [key, value] of Object.entries(cryptedModifiedData)) {
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
  
    /*
modifyData(20241631030, {
  file_status:"Inactive"
}).then(modifiedCount => {
  console.log(`Total modified records: ${modifiedCount}`);
}).catch(err => {
  console.error("Error:", err);
});
modifyData(20241631029, {
  file_status:"Inactive"
}).then(modifiedCount => {
  console.log(`Total modified records: ${modifiedCount}`);
}).catch(err => {
  console.error("Error:", err);
});
*/

module.exports = {modifyData}