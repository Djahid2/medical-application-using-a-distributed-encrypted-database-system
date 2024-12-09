const { MongoClient } = require("mongodb");
const Key = require("../crypto/modules/key");
const { extract_positions, RevealKey } = require('../crypto/modules/extract_positions.js');
require('../crypto/modules/aesCTR.js'); 
const Aes = require('../crypto/modules/aes.js');
const {getLastTenMatricules} = require('./GetLastMat.js');


const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

async function findData(matricule) {
  let data = {};
  const matriculeHashed = Key.hmacSHA256(matricule.toString()).toString("hex"); // Hash the matricule
  console.log("Searching for matricule:", matricule);
  console.log("Hashed matricule:", matriculeHashed);

  // Iterate through each MongoDB URI (node)
  for (const uri of NODE_URIS) {
    const client = new MongoClient(uri);
    try {
      console.log(`Connecting to MongoDB URI: ${uri}`);
      await client.connect();
      const db = client.db();
      const collection = db.collection("dossier_medical");
      
      // Fetch the document by hashed matricule
      const partialData = await collection.findOne({ _id: matriculeHashed });

      //console.log("Fetched data:", partialData);
      if (partialData) {
        // Add all fields to the `data` object, including emergency_contact, patient_matricule, and lab_results
        Object.keys(partialData).forEach(attribute => {
          if (partialData[attribute]) {
            data[attribute] = partialData[attribute];
          }
        });
        
        // Once all fields are found, no need to continue searching
        if (data.emergency_contact && data.patient_matricule && data.lab_results) {
          console.log("All data found, stopping search.");
          break;
        }
      }
    } catch (err) {
      console.error(`Error connecting to ${uri}:`, err.message);
    } finally {
      await client.close();
    }
  }

  // If all fields are found, proceed to reveal key and decrypt the data
  if (data.emergency_contact && data.patient_matricule && data.lab_results) {
      console.log("All required data found:", data);

      // Assuming positions are extracted from the hashed matricule
      const positions = extract_positions(matriculeHashed); // Extract positions from the hashed matricule

      // Use RevealKey to reveal the key from the three fields (strings)
      const { modifiedStrings, key } = RevealKey(positions, data.emergency_contact, data.patient_matricule, data.lab_results);
      //console.log("Modified strings:", modifiedStrings);
      console.log("Revealed key:", key);

      // Now decrypt each of the modified strings using the extracted key (assuming AES CTR)
      const decryptedStrings = modifiedStrings.map(modifiedString => {
          const decrypted = Aes.Ctr.decrypt(modifiedString, key, 256); // Decrypt each string
          return decrypted; // Convert from bytes to string
      });

      // Display the decrypted strings for the important fields
      //console.log("Decrypted Emergency Contact:", decryptedStrings[0]);
      //console.log("Decrypted Patient Matricule:", decryptedStrings[1]);
      //console.log("Decrypted Lab Results:", decryptedStrings[2]);

      // Now update the `data` object with the decrypted values
      data.emergency_contact = decryptedStrings[0];
      data.patient_matricule = decryptedStrings[1];
      data.lab_results = decryptedStrings[2];

      // Decrypt the rest of the data (except emergency_contact, patient_matricule, and lab_results)
      Object.keys(data).forEach(attribute => {
          // Skip the attributes we already decrypted
          if (attribute !== "emergency_contact" && attribute !== "patient_matricule" && attribute !== "lab_results" && attribute !== "_id") {
              if (typeof data[attribute] === "string") {
                  const decrypted = Aes.Ctr.decrypt(data[attribute], key, 256);
                  data[attribute] = decrypted; // Update the data with the decrypted value
              }
          }
      });
  } else {
      console.log(`No complete data found for matricule ${matricule}`);
  }

  return data;
}

async function findKey(matricule) {
  let data = {};
  const matriculeHashed = Key.hmacSHA256(matricule.toString()).toString("hex"); 
  console.log("Hashed matricule:", matriculeHashed);
  for (const uri of NODE_URIS) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("dossier_medical");
      const partialData = await collection.findOne({ _id: matriculeHashed });
      if (partialData) {
        // Add all fields to the `data` object, including emergency_contact, patient_matricule, and lab_results
        Object.keys(partialData).forEach(attribute => {
          if (partialData[attribute]) {
            data[attribute] = partialData[attribute];
          }
        });
        if (data.emergency_contact && data.patient_matricule && data.lab_results) {
          console.log("All data found, stopping search.");
          break;
        }
      }
    } catch (err) {
      console.error(`Error connecting to ${uri}:`, err.message);
    } finally {
      await client.close();
    }
  }
  if (data.emergency_contact && data.patient_matricule && data.lab_results) {
      const positions = extract_positions(matriculeHashed); 
      const { modifiedStrings, key } = RevealKey(positions, data.emergency_contact, data.patient_matricule, data.lab_results);
    return key;    
  }
}
/*

findData(20241631027).then(data => {
  console.log(data); 
});
findKey(20241631030).then(key => {
  console.log(key); 
});
*/

getLastTenMatricules(3).then(lastFive => {
  console.log(lastFive);  // Array of the last 5 matricules with their decrypted data
});


module.exports = {findData,findKey};
